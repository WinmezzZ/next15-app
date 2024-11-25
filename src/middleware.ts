import { auth } from '@/auth'

export function middleware(req: any, res: any) {
  return auth(req, res)
}

// // this middleware will be used to protect routes that require authentication
// export default auth({
//     callbacks: {
//       // this callback will run when the user logs in, if this callback returns false the user will be redirected to login page else user will be allowed to access the page
//       authorized: ({ token }: any) => {
//         // checking if the user has role of admin
//         if (token && token.role === "ADMIN") {
//           return true;
//         } else {
//           return false;
//         }
//       },
//     },
  
//     secret: process.env.NEXTAUTH_SECRET,
//   });

export const config = { matcher: ["/admin/:path*"] };
