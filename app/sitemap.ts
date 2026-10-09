import type { MetadataRoute } from "next";
import { projects, studio } from "@/data/studio";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: studio.origin + "/" },
    ...projects.map((p) => ({ url: `${studio.origin}/projects/${p.id}/` })),
  ];
}
