export interface SignInFormValues {
  email: string;
  password: string;
}

export interface SignUpFormValues {
  name: string;
  email: string;
  password: string;
  profileImage?: File | null;
  profileImageUrl?: string;
}
