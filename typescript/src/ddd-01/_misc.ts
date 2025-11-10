type UserId = string & { _brand: "user_id" };
type PostId = string & { _brand: "post_id" };

const userId: UserId = "id_1" as UserId;
const postId: PostId = "id_1" as PostId;

const logUser = (u: UserId) => {
  console.log("user:->", u);
};

// console.log(userId._brand === postId._brand)
logUser(userId);
