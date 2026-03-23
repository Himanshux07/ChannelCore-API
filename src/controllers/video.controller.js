import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const skip = (pageNum - 1) * limitNum

    let filter = {}
    if(query){
        filter.title = { $regex: query, $options: "i" }
    }
    if(userId){
        filter.owner = userId
    }
    const sort={}

    if(sortBy){
        sort[sortBy] = sortType === "desc" ? -1 : 1
    }
    const videos = await Video.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)

    return res.status(200).json(new ApiResponse(200, videos, "Videos fetched successfully"))

})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    if(!req.files?.video || !req.files?.thumbnail){
        throw new ApiError(400, "Video and thumbnail files are required")
    }
    const videoFile = req.files?.video?.[0]?.path
    const thumbnailFile = req.files?.thumbnail?.[0]?.path
    const videoUploadResult = await uploadOnCloudinary(videoFile, "video")
    if(!videoUploadResult || !videoUploadResult.secure_url){
        throw new ApiError(500, "Video upload failed")
    }
    const thumbnailUploadResult = await uploadOnCloudinary(thumbnailFile, "image")
    if(!thumbnailUploadResult || !thumbnailUploadResult.secure_url){
        throw new ApiError(500, "Thumbnail upload failed")
    }
    const video = await Video.create({
        title,
        description,
        videoUrl: videoUploadResult.secure_url,
        thumbnailUrl: thumbnailUploadResult.secure_url,
        owner: req.user._id
    })
    return res.status(201).json(new ApiResponse(201, video, "Video published successfully"))

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}