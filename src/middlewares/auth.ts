export { auth as middleware } from '@/auth'

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

// // Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
// export const config = {
//     matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
//   }