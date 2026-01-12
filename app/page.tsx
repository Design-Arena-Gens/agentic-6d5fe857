'use client'

import { useState, useEffect } from 'react'

export default function Home() {
  const [videos, setVideos] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState('')
  const [scheduleTime, setScheduleTime] = useState('10:00')
  const [isConfigured, setIsConfigured] = useState(false)

  useEffect(() => {
    fetchVideos()
    checkConfig()
  }, [])

  const checkConfig = async () => {
    try {
      const res = await fetch('/api/config/check')
      const data = await res.json()
      setIsConfigured(data.configured)
    } catch (error) {
      console.error('Failed to check config:', error)
    }
  }

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/videos')
      const data = await res.json()
      setVideos(data.videos || [])
    } catch (error) {
      console.error('Failed to fetch videos:', error)
    }
  }

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    setUploading(true)
    setStatus('Uploading video...')

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (res.ok) {
        setStatus('Video uploaded successfully!')
        fetchVideos()
        e.currentTarget.reset()
      } else {
        setStatus(`Error: ${data.error}`)
      }
    } catch (error) {
      setStatus('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handlePublishNow = async (videoId: string) => {
    setStatus('Publishing to Instagram...')

    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus('Video published successfully!')
        fetchVideos()
      } else {
        setStatus(`Error: ${data.error}`)
      }
    } catch (error) {
      setStatus('Publish failed. Please try again.')
    }
  }

  const handleSaveSchedule = async () => {
    try {
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ time: scheduleTime }),
      })

      if (res.ok) {
        setStatus('Schedule updated successfully!')
      } else {
        setStatus('Failed to update schedule')
      }
    } catch (error) {
      setStatus('Failed to update schedule')
    }
  }

  const handleDeleteVideo = async (videoId: string) => {
    try {
      const res = await fetch(`/api/videos/${videoId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setStatus('Video deleted')
        fetchVideos()
      }
    } catch (error) {
      setStatus('Failed to delete video')
    }
  }

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-purple-100 to-pink-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          📱 Instagram Video Upload Agent
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Automated daily video posting to your Instagram account
        </p>

        {!isConfigured && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-6">
            <p className="font-bold">⚠️ Configuration Required</p>
            <p className="text-sm">Please set your Instagram credentials in environment variables:</p>
            <ul className="text-sm mt-2 ml-4 list-disc">
              <li>INSTAGRAM_USERNAME</li>
              <li>INSTAGRAM_PASSWORD</li>
            </ul>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">📤 Upload Video</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video File (MP4)
                </label>
                <input
                  type="file"
                  name="video"
                  accept="video/mp4,video/quicktime"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caption
                </label>
                <textarea
                  name="caption"
                  rows={3}
                  placeholder="Enter your video caption..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                {uploading ? 'Uploading...' : 'Upload Video'}
              </button>
            </form>
          </div>

          {/* Schedule Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">⏰ Schedule Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Upload Time (UTC)
                </label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                onClick={handleSaveSchedule}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
              >
                Save Schedule
              </button>

              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>How it works:</strong>
                </p>
                <ul className="text-sm text-blue-700 mt-2 ml-4 list-disc">
                  <li>Upload videos to the queue</li>
                  <li>Agent posts the oldest video daily at scheduled time</li>
                  <li>Or manually publish immediately</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Status Message */}
        {status && (
          <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
            <p className="text-center text-gray-800">{status}</p>
          </div>
        )}

        {/* Video Queue */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">📋 Video Queue</h2>

          {videos.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No videos in queue. Upload some videos to get started!</p>
          ) : (
            <div className="space-y-4">
              {videos.map((video, index) => (
                <div key={video.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-gray-800">{video.caption || 'No caption'}</p>
                        <p className="text-sm text-gray-500">
                          Uploaded: {new Date(video.uploadedAt).toLocaleString()}
                        </p>
                        {video.published && (
                          <p className="text-sm text-green-600">
                            ✓ Published: {new Date(video.publishedAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!video.published && (
                      <button
                        onClick={() => handlePublishNow(video.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition text-sm"
                      >
                        Publish Now
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteVideo(video.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
