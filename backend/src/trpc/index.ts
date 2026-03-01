import { router } from "./trpc.js";
import { profileRouter } from "./routers/profile.js";
import { postRouter } from "./routers/post.js";
import { communityRouter } from "./routers/community.js";
import { tipsRouter } from "./routers/tips.js";
import { notificationRouter } from "./routers/notification.js";

export const appRouter = router({
  profile: profileRouter,
  post: postRouter,
  community: communityRouter,
  tips: tipsRouter,
  notification: notificationRouter,
});

export type AppRouter = typeof appRouter;
