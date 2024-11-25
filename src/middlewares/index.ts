import {
  NextMiddleware,
  NextResponse
} from "next/server";

export type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware;

export function combineMiddlewares(functions: MiddlewareFactory[] = [], index = 0): NextMiddleware {
  const current = functions[index];
  if (current) {
    const next = combineMiddlewares(functions, index + 1);
    return current(next);
  }
  return function middleware() {
    return NextResponse.next()
  };
}