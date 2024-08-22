import supabase, { supabaseUrl } from "./supabase";

export async function signup({ fullName, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { fullName, avatar: "" } },
  });

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();

  if (!session.session) return null;

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data?.user;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function updateCurrentUser({ password, fullName, avatar }) {
  //update password OR fullName
  let updateData;

  if (password) updateData = { password };

  if (fullName) updateData = { data: { fullName } };

  const { data, error: updateError } = await supabase.auth.updateUser(
    updateData
  );

  if (updateError) {
    console.error(updateError);
    throw new Error(updateError.message);
  }

  if (!avatar) return data;

  //upload avatar image

  const fileName = `avatar-${data.user.id}-${Math.random()}`;

  const { error: avatarUploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, avatar);

  if (avatarUploadError) {
    console.error(avatarUploadError);
    throw new Error(avatarUploadError.message);
  }

  //update avatar in the user

  const { data: updatedUser, error: userAvatarError } =
    supabase.auth.updateUser({
      data: {
        avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
      },
    });

  if (userAvatarError) {
    console.error(userAvatarError);
    throw new Error(userAvatarError.message);
  }

  return updatedUser;
}
