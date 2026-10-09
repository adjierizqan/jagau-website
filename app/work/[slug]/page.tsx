import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allWorkspaceProjects } from "@/data/workspace";
import { RedirectTo } from "@/components/RedirectTo";
export const dynamicParams=false;
export const metadata:Metadata={robots:{index:false,follow:true}};
export function generateStaticParams(){return allWorkspaceProjects.map(p=>({slug:p.slug}));}
export default async function Legacy({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(!allWorkspaceProjects.some(p=>p.slug===slug))notFound();return <RedirectTo href={`/projects/${slug}/`}/>;}
