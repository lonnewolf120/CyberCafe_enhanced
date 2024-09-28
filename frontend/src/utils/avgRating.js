export default function GetAvgRating(ratingArr) {
  if(typeof ratingArr === Number) {console.log("rating is a Number");return ratingArr;}
  if (ratingArr?.length === 0) return 0;
  const totalReviewCount = ratingArr?.reduce((acc, curr) => {
    acc += curr.RATING
    return acc
  }, 0)

  const multiplier = Math.pow(10, 1)
  const avgReviewCount =
    Math.round((totalReviewCount / ratingArr?.length) * multiplier) / multiplier
  console.log("The avg rating:", avgReviewCount, "total: ", totalReviewCount)
  return avgReviewCount
}