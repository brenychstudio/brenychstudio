"""Runtime checks for the authored Home across its three device compositions.

Run against a fresh Vite dev server or the production preview with Python Playwright installed.
The assertions exercise navigation, viewport safety, and motion/media policy in a
real browser; the existing npm validation scripts cover canonical project facts.
"""

from __future__ import annotations

import argparse
from pathlib import Path

from playwright.sync_api import sync_playwright


CHROME = Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")
VIEWPORTS = [(390, 844), (430, 932), (768, 1024), (1024, 768), (1440, 900), (1920, 1080), (1440, 650)]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", default="http://127.0.0.1:5173/")
    parser.add_argument("--screenshots", type=Path)
    parser.add_argument("--width", type=int, help="Run one viewport width while iterating")
    args = parser.parse_args()
    if args.screenshots:
        args.screenshots.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(
            executable_path=str(CHROME), headless=True,
            args=["--enable-webgl", "--use-angle=swiftshader"],
        )
        for width, height in VIEWPORTS:
            if args.width is not None and width != args.width:
                continue
            context = browser.new_context(
                viewport={"width": width, "height": height},
                device_scale_factor=1,
                has_touch=width < 1024,
                reduced_motion="no-preference",
            )
            page = context.new_page()
            console_errors: list[str] = []
            failed_assets: list[str] = []
            video_requests: list[str] = []
            image_requests: list[str] = []
            page.on("pageerror", lambda error: console_errors.append(str(error)))
            page.on("requestfailed", lambda request: failed_assets.append(request.url) if request.resource_type in ("script", "stylesheet") else None)
            page.on("request", lambda request: video_requests.append(request.url) if request.resource_type == "media" else None)
            page.on("request", lambda request: image_requests.append(request.url) if request.resource_type == "image" else None)
            page.goto(args.url, wait_until="domcontentloaded")
            page.wait_for_selector("#collaboration", timeout=20000)
            page.wait_for_timeout(900)

            assert page.locator("h1").first.is_visible(), f"{width}: opening heading missing"
            assert page.locator("#ecosystem, #products, #evidence, #spatial, #research, #worlds, #collaboration").count() == 7
            assert not console_errors, f"{width}: page errors: {console_errors}"
            assert not failed_assets, f"{width}: failed JS/CSS: {failed_assets}"
            assert not video_requests, f"{width}: eager media requests: {video_requests}"
            if width < 1024:
                assert not any("/Whisper/desktop/whisper-hero.jpg" in url for url in image_requests), f"{width}: raw offscreen spatial poster fetched"

            metrics = page.evaluate("""() => ({
                page: document.documentElement.scrollWidth,
                viewport: document.documentElement.clientWidth,
                headingRight: document.querySelector('h1').getBoundingClientRect().right,
                ctaRight: document.querySelector('.eco-hero-actions').getBoundingClientRect().right,
            })""")
            assert metrics["page"] <= metrics["viewport"] + 2, f"{width}: horizontal overflow {metrics}"
            assert metrics["headingRight"] <= width + 2, f"{width}: clipped heading {metrics}"
            assert metrics["ctaRight"] <= width + 2, f"{width}: clipped CTA {metrics}"
            if width == 768:
                field_width = page.locator('.eco-spatial-field').bounding_box()["width"]
                plane_widths = [page.locator(f'.eco-spatial-plane-{index}').bounding_box()["width"] for index in (1, 2)]
                assert min(plane_widths) >= field_width * .9, f"768: Spatial cases compressed into parallel columns: field={field_width}, planes={plane_widths}"
            if width == 1024:
                rail_target = page.locator('.home-section-rail').get_by_role('button', name='02 Ecosystem').bounding_box()
                assert rail_target["width"] >= 44 and rail_target["height"] >= 44, f"1024: rail touch target too small: {rail_target}"
                menu = page.get_by_role("button", name="Open route terminal")
                assert menu.is_visible(), "1024: compact Home header missing"
                menu.click()
                assert page.get_by_role("dialog").is_visible(), "1024: route terminal failed to open"
                page.keyboard.press("Escape")
                page.wait_for_function("!document.querySelector('[role=dialog]')", timeout=3000)
                assert not page.get_by_role("dialog").is_visible(), "1024: route terminal did not close"
                assert page.evaluate("document.body.style.overflow") != "hidden", "1024: touch scroll remained locked"

            if width < 1024:
                chapter = page.get_by_role("button", name="Choose chapter")
                assert chapter.is_visible(), f"{width}: compact chapter control missing"
                if width < 768:
                    assert chapter.bounding_box()["width"] <= 60, f"{width}: closed chapter control obscures content"
                chapter.tap()
                assert page.get_by_role("link", name="04 Evidence").is_visible(), f"{width}: chapter list missing"
                page.get_by_role("link", name="04 Evidence").tap()
                page.wait_for_function("document.querySelector('#evidence').getBoundingClientRect().top < innerHeight", timeout=5000)
                assert page.locator("#evidence").bounding_box()["y"] < height, f"{width}: evidence navigation failed"
                if width == 390:
                    assert page.evaluate("document.activeElement.id") == "evidence", "390: selecting a chapter loses keyboard focus"
                assert page.locator("#products .mobile-motion-media").count() > 0, f"{width}: mobile motion media unused"
                before_touch_scroll = page.evaluate("scrollY")
                cdp = context.new_cdp_session(page)
                cdp.send("Input.dispatchTouchEvent", {"type": "touchStart", "touchPoints": [{"x": width / 2, "y": height * .8}]})
                for step in range(1, 7):
                    cdp.send("Input.dispatchTouchEvent", {"type": "touchMove", "touchPoints": [{"x": width / 2, "y": height * (.8 - step * .1)}]})
                    page.wait_for_timeout(35)
                cdp.send("Input.dispatchTouchEvent", {"type": "touchEnd", "touchPoints": []})
                page.wait_for_timeout(250)
                assert page.evaluate("scrollY") > before_touch_scroll + 80, f"{width}: vertical touch scroll trapped"
            else:
                rail = page.locator(".home-section-rail")
                assert rail.is_visible(), f"{width}: section rail missing"
                rail.get_by_role("button", name="04 Evidence").focus()
                page.keyboard.press("Enter")
                page.wait_for_function("document.querySelector('#evidence').getBoundingClientRect().top < innerHeight", timeout=5000)
                assert page.locator("#evidence").bounding_box()["y"] < height, f"{width}: rail navigation failed"
                if width == 1440:
                    # A fresh navigation ends the rail's smooth-scroll animation before
                    # checking scroll-driven scene states at exact stage positions.
                    page.goto(args.url, wait_until="domcontentloaded")
                    page.wait_for_selector("#collaboration", timeout=20000)
                    page.wait_for_timeout(500)
                    page.locator('.eco-map-territory-1').hover()
                    page.evaluate("""() => {
                      const stage = document.querySelector('.eco-map-stage');
                      const rect = stage.getBoundingClientRect();
                      scrollTo({top: rect.top + scrollY + (rect.height - innerHeight) * .65, behavior:'instant'});
                    }""")
                    page.wait_for_timeout(400)
                    assert page.locator('.home-section-rail').get_by_role('button', name='02 Ecosystem').get_attribute('aria-current') == 'true', '1440: rail loses active ecosystem stage'
                    assert page.locator('.eco-map-territory-4').get_attribute('data-territory-state') == 'active', '1440: pointer hover blocked scroll-driven ecosystem progression'
                    product_link = page.locator('.eco-products-stage__project[data-product-index="0"] .eco-products-stage__poster-link')
                    product_link.focus()
                    page.evaluate("""() => {
                      const stage = document.querySelector('.eco-products-stage__timeline');
                      const rect = stage.getBoundingClientRect();
                      scrollTo({top: rect.top + scrollY + (rect.height - innerHeight) * .8, behavior:'instant'});
                    }""")
                    page.wait_for_timeout(850)
                    focused_product_opacity = product_link.evaluate("e => Number(getComputedStyle(e.closest('.eco-products-stage__project')).opacity)")
                    assert focused_product_opacity >= .95, f"1440: focused product faded out: {focused_product_opacity}"
                    page.locator('.home-section-rail').get_by_role('button', name='06 Research / Worlds').focus()
                    page.evaluate("""() => {
                      const stage = document.querySelector('.eco-transform-scroll');
                      const rect = stage.getBoundingClientRect();
                      scrollTo({top: rect.top + scrollY + (rect.height - innerHeight) * .78, behavior:'instant'});
                    }""")
                    page.wait_for_function("document.querySelector('.eco-transform-scroll').dataset.phase === 'worlds'", timeout=3000)
                    page.wait_for_function("Number(getComputedStyle(document.querySelector('.eco-transform-research-copy')).opacity) <= .02", timeout=5000)
                    research_opacity = page.locator(".eco-transform-research-copy").evaluate("e => Number(getComputedStyle(e).opacity)")
                    assert research_opacity <= .02, f"worlds text obscured by previous research copy: opacity={research_opacity}"

            if args.screenshots and (width, height) != (1440, 650):
                page.goto(args.url, wait_until="domcontentloaded")
                page.wait_for_selector("#collaboration", timeout=20000)
                page.screenshot(path=str(args.screenshots / f"home-r1-{width}.png"), full_page=True)
            print(f"VIEWPORT_{width}x{height}=PASS")
            context.close()

        if args.width is None or args.width == 390:
            reduced = browser.new_context(viewport={"width": 390, "height": 844}, reduced_motion="reduce", has_touch=True)
            page = reduced.new_page()
            page.goto(args.url, wait_until="domcontentloaded")
            page.wait_for_selector("#collaboration", timeout=20000)
            assert page.locator("#products .mobile-motion-media[data-motion-ready='false']").count() > 0
            assert page.locator("#spatial video[src]").count() == 0
            print("REDUCED_MOTION_390=PASS")
            reduced.close()
        if args.width is None or args.width == 1440:
            reduced = browser.new_context(viewport={"width": 1440, "height": 900}, reduced_motion="reduce")
            page = reduced.new_page()
            page.goto(args.url, wait_until="domcontentloaded")
            page.wait_for_selector("#collaboration", timeout=20000)
            stages = page.evaluate("""() => Object.fromEntries(['.eco-map-stage', '.eco-transform-scroll'].map(selector => {
              const stage = document.querySelector(selector);
              const sticky = stage.querySelector('.eco-map-field, .eco-transform-sticky');
              return [selector, {height:stage.getBoundingClientRect().height, position:getComputedStyle(sticky).position}];
            }))""")
            assert all(stage["height"] <= 1200 and stage["position"] != "sticky" for stage in stages.values()), f"reduced desktop retains idle pinned scroll: {stages}"
            print("REDUCED_MOTION_1440=PASS")
            reduced.close()
            media_context = browser.new_context(viewport={"width": 1440, "height": 900})
            page = media_context.new_page()
            media_requests: list[str] = []
            page.on("request", lambda request: media_requests.append(request.url) if request.resource_type == "media" else None)
            page.goto(args.url, wait_until="domcontentloaded")
            page.wait_for_selector("#collaboration", timeout=20000)
            page.evaluate("""() => {
              const stage = document.querySelector('.eco-spatial-stage');
              const rect = stage.getBoundingClientRect();
              scrollTo({top:rect.top + scrollY, behavior:'instant'});
            }""")
            page.wait_for_timeout(1400)
            assert page.locator('.eco-spatial-plane-1').bounding_box()["height"] < 50
            assert page.locator('.eco-spatial-managed-video').count() == 0
            assert not media_requests, f"spatial video requested during scanline: {media_requests}"
            page.evaluate("""() => {
              const stage = document.querySelector('.eco-spatial-stage');
              const rect = stage.getBoundingClientRect();
              scrollTo({top:rect.top + scrollY + (rect.height - innerHeight) * .36, behavior:'instant'});
            }""")
            page.wait_for_function("!!document.querySelector('.eco-spatial-managed-video video[src]')", timeout=7000)
            page.wait_for_timeout(500)
            assert page.locator('.eco-spatial-plane-1').bounding_box()["height"] > 300
            assert len(media_requests) == 1, f"spatial reveal media count: {media_requests}"
            page.evaluate("""() => {
              const stage = document.querySelector('.eco-spatial-stage');
              const rect = stage.getBoundingClientRect();
              scrollTo({top:rect.top + scrollY, behavior:'instant'});
            }""")
            page.wait_for_function("document.querySelector('.eco-spatial-managed-video video')?.paused === true", timeout=5000)
            assert page.locator('.eco-spatial-managed-video').evaluate("e => getComputedStyle(e).display") == "none"
            print("SPATIAL_MEDIA_LIFECYCLE=PASS")
            media_context.close()
        browser.close()


if __name__ == "__main__":
    main()
