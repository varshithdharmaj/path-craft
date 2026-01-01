"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import CourseBasicInfo from "./_components/CourseBasicInfo";
import CourseDetail from "./_components/CourseDetail";
import ChapterList from "./_components/ChapterList";
import { Button } from "@/components/ui/button";
import LoadingDialog from "../_components/LoadingDialog";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

function CourseLayout({ params }) {
  const Params = React.use(params);
  const { user } = useUser();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { toast } = useToast();

  useEffect(() => {
    // console.log(Params); //courseId
    // console.log(user);

    if (Params && user) {
      GetCourse();
    }
  }, [Params, user]);

  const GetCourse = async () => {
    try {
      const params = await Params;
      const response = await fetch(`/api/courses/${params?.courseId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch course");
      }
      
      const courseData = await response.json();
      setCourse(courseData);
    } catch (error) {
      console.error("Error fetching course:", error);
      toast({
        variant: "destructive",
        duration: 3000,
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  };

  const GenerateChapterContent = async () => {
    setLoading(true);
  
    try {
      const chapters = course?.courseOutput?.Chapters;
      const includeVideo = course?.includeVideo;
  
      // Delete previous content if generated and got any error
      const checkResponse = await fetch(`/api/chapters?courseId=${course?.courseId}`);
      const checkPreviousContent = await checkResponse.json();
  
      if (checkPreviousContent.length > 0) {
        await fetch(`/api/chapters/${course?.courseId}`, {
          method: "DELETE",
        });
      }
  
      for (const [index, chapter] of chapters.entries()) {
        const PROMPT = `
          Generate detailed content for the following topic in strict JSON format:
          - Topic: ${course?.name}
          - Chapter: ${chapter?.ChapterName}
  
          The response must be a valid JSON object containing an array of objects with the following fields:
          1. "title": A short and descriptive title for the subtopic.
          2. "explanation": A detailed explanation of the subtopic.
          3. "codeExample": A code example (if applicable) wrapped in <precode> tags, or an empty string if no code example is available.
  
          Ensure:
          - The JSON is valid and follows the specified format.
          - Proper escaping of special characters.
          - No trailing commas or malformed syntax.
          - The response can be parsed directly using JSON.parse().
  
          Example format:
          {
            "title": "Topic Title",
            "chapters": [
              {
                "title": "Subtopic Title",
                "explanation": "Detailed explanation here.",
                "codeExample": "<precode>Code example here</precode>"
              }
            ]
          }
        `;
  
        // Call AI API to generate chapter content
        const aiResponse = await fetch("/api/ai/generate-content", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: PROMPT }),
        });
  
        if (!aiResponse.ok) {
          const errorData = await aiResponse.json();
          throw new Error(errorData.error || "Failed to generate chapter content");
        }
  
        const content = await aiResponse.json();
  
        // Generate Video URL
        let videoId = [];
        if (includeVideo === "Yes") {
          const videoQuery = course?.name + ":" + chapter?.ChapterName;
          const videoResponse = await fetch(`/api/youtube?q=${encodeURIComponent(videoQuery)}&maxResults=3`);
          
          if (videoResponse.ok) {
            const videos = await videoResponse.json();
            videoId = videos?.slice(0, 3).map((vid) => vid?.id?.videoId) || [];
          }
        }
  
        // Save Chapter Content + Video URL
        const saveResponse = await fetch("/api/chapters", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseId: course?.courseId,
            chapterId: index,
            content: JSON.stringify(content),
            videoId: videoId,
          }),
        });
  
        if (!saveResponse.ok) {
          throw new Error("Failed to save chapter");
        }
  
        toast({
          duration: 2000,
          title: `Chapter ${index + 1} Generated Successfully!`,
          description: `Chapter ${index + 1} has been generated successfully!`,
        });
      }
  
      // Update course to published
      await fetch(`/api/courses/${course?.courseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publish: true }),
      });
  
      toast({
        variant: "success",
        duration: 3000,
        title: "Course Content Generated Successfully!",
        description: "Course Content has been generated successfully!",
      });
  
      router.replace("/create-course-path/" + course?.courseId + "/finish");
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        duration: 5000,
        title: "Uh oh! Something went wrong.",
        description: error?.message || "An unexpected error occurred!",
      });
  
      await GetCourse();
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <LoadingDialog loading={loading} />
      <div className="mt-10 px-7 md:px-20 lg:px-44">
        <h2 className="font-bold text-center text-2xl">Course Layout</h2>
        {/* Basic Info */}
        <CourseBasicInfo course={course} refreshData={() => GetCourse()} />
        {/* Course Detail */}
        <CourseDetail course={course} />
        {/* List of Lesson */}
        <ChapterList course={course} refreshData={() => GetCourse()} />

        <Button onClick={() => GenerateChapterContent()} className="my-10">
          Generate Course Content
        </Button>
      </div>
    </>
  );
}

export default CourseLayout;
