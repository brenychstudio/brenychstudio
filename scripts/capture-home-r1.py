"""Capture Home R1 checkpoints and full-page motion recordings in Chrome.

Requires Python Playwright and ffmpeg. Run after starting the local Vite server.
The output directory is intentionally outside the repository by default.
"""

from __future__ import annotations

import argparse
import subprocess
from pathlib import Path

from playwright.sync_api import sync_playwright


CHROME = Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")
VIEWPORTS = {
    "390": (390, 844), "430": (430, 932), "768": (768, 1024),
    "1024": (1024, 768), "1440": (1440, 900), "1920": (1920, 1080),
}
CHECKPOINTS = {
    "390": ("opening", "products", "evidence", "spatial", "research", "collaboration"),
    "430": ("opening", "evidence", "spatial"),
    "768": ("opening", "ecosystem", "products", "spatial", "research"),
    "1024": ("opening", "ecosystem", "products", "spatial"),
    "1440": ("opening", "ecosystem", "products", "evidence", "spatial", "research", "worlds", "collaboration"),
    "1920": ("opening", "evidence", "spatial", "collaboration"),
}
STAGE_CHECKPOINTS = {
    "390": ((".eco-products-stage__project[data-product-index='1']", 0, "product-02"),
            (".eco-evidence-chapter-shell-2", 0, "evidence-02"),
            (".eco-spatial-plane-2", 0, "spatial-02")),
    "768": ((".eco-spatial-plane-1", 0, "spatial-01"),
            (".eco-spatial-plane-2", 0, "spatial-02")),
    "1024": ((".eco-spatial-stage", .55, "spatial-handoff"),),
    "1440": ((".eco-map-stage", .65, "ecosystem-active"),
             (".eco-products-stage__timeline", .65, "product-02"),
             (".eco-evidence-chapter-shell-2", 0, "evidence-02"),
             (".eco-spatial-stage", .3, "spatial-whisper"),
             (".eco-spatial-stage", .75, "spatial-orbit"),
             (".eco-transform-scroll", .45, "system-handoff"),
             (".eco-transform-scroll", .78, "worlds-resolved")),
    "1920": ((".eco-spatial-stage", .42, "spatial-whisper"),),
}
RECORDINGS = {
    "desktop": (1440, 900, 46),
    "mobile": (390, 844, 58),
    "tablet": (768, 1024, 50),
}


def new_page(browser, width: int, height: int, video_dir: Path | None = None):
    options = dict(
        viewport={"width": width, "height": height},
        device_scale_factor=1,
        has_touch=width < 1024,
        reduced_motion="no-preference",
    )
    if video_dir:
        options.update(record_video_dir=str(video_dir), record_video_size={"width": width, "height": height})
    context = browser.new_context(**options)
    page = context.new_page()
    return context, page


def load(page, url: str) -> None:
    page.goto(url, wait_until="domcontentloaded")
    page.wait_for_selector("#collaboration", timeout=30000)
    page.wait_for_timeout(1100)


def checkpoints(browser, url: str, output: Path, viewport: str | None = None) -> None:
    for name, (width, height) in VIEWPORTS.items():
        if viewport and name != viewport:
            continue
        context, page = new_page(browser, width, height)
        load(page, url)
        for section in CHECKPOINTS[name]:
            page.evaluate("id => document.getElementById(id).scrollIntoView({behavior:'instant',block:'start'})", section)
            page.wait_for_timeout(900)
            page.screenshot(path=str(output / f"Home R1 {name} {section}.png"))
        for selector, progress, label in STAGE_CHECKPOINTS.get(name, ()):
            page.evaluate("""([selector, progress]) => {
              const rect = document.querySelector(selector).getBoundingClientRect();
              const top = rect.top + scrollY;
              const travel = Math.max(0, rect.height - innerHeight);
              scrollTo({top: top + travel * progress, behavior:'instant'});
            }""", [selector, progress])
            page.wait_for_timeout(1000)
            page.screenshot(path=str(output / f"Home R1 {name} {label}.png"))
        print(f"SCREENSHOTS_{name}={len(CHECKPOINTS[name])}", flush=True)
        context.close()


def recordings(browser, url: str, output: Path, recording: str | None = None) -> None:
    for name, (width, height, seconds) in RECORDINGS.items():
        if recording and name != recording:
            continue
        raw_dir = output / "raw-video"
        raw_dir.mkdir(exist_ok=True)
        context, page = new_page(browser, width, height, raw_dir)
        load(page, url)
        page.evaluate("window.scrollTo(0, 0)")
        page.wait_for_timeout(1700)
        page.evaluate("""async duration => {
          const maximum = document.documentElement.scrollHeight - innerHeight;
          await new Promise(resolve => {
            let started = 0;
            const frame = now => {
              if (!started) started = now;
              const progress = Math.min(1, (now - started) / duration);
              window.scrollTo(0, maximum * progress);
              if (progress < 1) requestAnimationFrame(frame); else resolve();
            };
            requestAnimationFrame(frame);
          });
        }""", seconds * 1000)
        page.wait_for_timeout(1700)
        video = page.video
        context.close()
        raw = raw_dir / f"Home R1 {name}.webm"
        video.save_as(str(raw))
        target = output / f"Home R1 {name}.mp4"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw), "-c:v", "libx264", "-crf", "20", "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(target)], check=True)
        print(f"RECORDING_{name}={target}", flush=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", default="http://127.0.0.1:5173/")
    parser.add_argument("--output", type=Path, default=Path.home() / "Videos" / "Home R1 QA")
    parser.add_argument("--only", choices=("screenshots", "recordings"))
    parser.add_argument("--viewport", choices=tuple(VIEWPORTS))
    parser.add_argument("--recording", choices=tuple(RECORDINGS))
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(executable_path=str(CHROME), headless=True,
            args=["--enable-webgl", "--use-angle=swiftshader"])
        if args.only != "recordings":
            checkpoints(browser, args.url, args.output, args.viewport)
        if args.only != "screenshots":
            recordings(browser, args.url, args.output, args.recording)
        browser.close()


if __name__ == "__main__":
    main()
