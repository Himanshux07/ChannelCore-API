import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content } = req.body
    if(!content || content.trim() === ""){
        throw new ApiError(400, "Content is required")
    }
    const tweet = await Tweet.create({
        owner: req.user._id,
        content : content.trim()
    })
    return res.status(201).json(new ApiResponse(201, tweet, "Tweet created successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const userId = req.params.userId
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user id")
    }
    const user = await User.findById(userId)
    if(!user){
        throw new ApiError(404, "User not found")
    }
    const tweets = await Tweet.find({ owner: userId }).sort({ createdAt: -1 })
    return res.status(200).json(new ApiResponse(200, tweets, "User tweets fetched successfully"))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet id")
    }
    const updatedContent = req.body.content
    if(!updatedContent || updatedContent.trim() === ""){
        throw new ApiError(400, "Content is required")
    }
    const tweet = await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(404, "Tweet not found")
    }
    if(tweet.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You are not authorized to update this tweet")
    }
    tweet.content = updatedContent.trim()
    await tweet.save()
    return res.status(200).json(new ApiResponse(200, tweet, "Tweet updated successfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}