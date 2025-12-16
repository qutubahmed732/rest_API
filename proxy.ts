import { NextResponse } from "next/server";
import { authProxy } from "./middlewares/api/authProxy";
import { logProxy } from "./middlewares/api/logProxy";

const config = {
    matcher: "/api/:path*",
};

export default function middleware(request: Request) {

    if (request.url.includes("/api/blogs")) {
        const logResult = logProxy(request);
    }

    const authProxyResult = authProxy(request);
    if (authProxyResult?.isValid) {
        return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }
    return NextResponse.next();
}