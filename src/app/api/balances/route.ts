import { NextRequest } from "next/server";
import { post } from "./utils/post";
import { put } from "./utils/put";
import { get } from "./utils/get";
import { del } from "./utils/del";

export const POST = async (request: NextRequest) => post(request);
export const PUT = async (request: NextRequest) => put(request);
export const GET = async () => get();
export const DELETE = async (request: NextRequest) => del(request);
