import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextRequest } from "next/dist/server/web/spec-extension/request";
import { NextResponse } from "next/dist/server/web/spec-extension/response";

function directToUnauthenticated(
  verify: RequestCookie | undefined,
  url: string | string[]
) {
  return (
    !verify &&
    (url.includes("/notification") ||
      url.includes("/notification/create") ||
      url.includes("/members") ||
      url.includes("/profile") ||
      url === "http://localhost:3000/")
  );
}

export default function middleware(
  req: NextRequest
): NextResponse<unknown> | undefined {
  let verify = req.cookies.get("accessToken");
  let url = req.url;

  if (directToUnauthenticated(verify, url)) {
    return NextResponse.redirect(
      "http://localhost:3000/auth/sign-in"
    );
  }

  if (verify && url.includes("/auth")) {
    return NextResponse.redirect("http://localhost:3000/");
  }

  return NextResponse.next();
}
