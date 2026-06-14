import { useEffect } from "react";

export type StructuredDataValue = Record<string, unknown>;

type StructuredDataProps = {
  id: string;
  data: StructuredDataValue | StructuredDataValue[];
};

export default function StructuredData({ id, data }: StructuredDataProps) {
  useEffect(() => {
    let tag = document.getElementById(id) as HTMLScriptElement | null;

    if (!tag) {
      tag = document.createElement("script");
      tag.id = id;
      tag.type = "application/ld+json";
      document.head.appendChild(tag);
    }

    tag.textContent = JSON.stringify(data);

    return () => {
      tag?.remove();
    };
  }, [data, id]);

  return null;
}
