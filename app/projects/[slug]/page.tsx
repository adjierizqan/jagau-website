import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WorkspacePrototype } from "@/components/WorkspacePrototype";
import { allWorkspaceProjects } from "@/data/workspace";
export const dynamicParams = false;
export function generateStaticParams() {return allWorkspaceProjects.map(p=>({slug:p.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const p=allWorkspaceProjects.find(p=>p.slug===slug);return p?{title:p.title,description:p.summary,alternates:{canonical:`/projects/${slug}/`},openGraph:{title:`${p.title} — JAGAU founder work`,description:p.summary,url:`/projects/${slug}/`,images:[p.socialImage ?? "/social.png"]}}:{};}
export default async function Project({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(!allWorkspaceProjects.some(p=>p.slug===slug))notFound();return <WorkspacePrototype initialProject={slug}/>;}
