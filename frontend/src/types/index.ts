export interface Profile {
  wallet: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUri: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  createdAt: number;
  bump: number;
}

export interface Post {
  address: string;
  author: string;
  content: string;
  mediaUri?: string;
  likesCount: number;
  commentsCount: number;
  tipsTotal: number;
  createdAt: number;
  community?: string;
  isLiked?: boolean;
}

export interface Comment {
  address: string;
  author: string;
  post: string;
  content: string;
  createdAt: number;
  authorProfile?: Profile;
}

export interface Follow {
  follower: string;
  following: string;
  createdAt: number;
}

export interface Like {
  user: string;
  post: string;
  createdAt: number;
}

export interface Community {
  name: string;
  description: string;
  creator: string;
  membersCount: number;
  postsCount: number;
  createdAt: number;
}

export interface Tip {
  from: string;
  to: string;
  post: string;
  amount: number;
  createdAt: number;
}

export interface FeedPage {
  posts: Post[];
  nextCursor?: string;
}
