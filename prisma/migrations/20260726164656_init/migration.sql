-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "role" TEXT,
    "level" TEXT,
    "targetCompany" TEXT,
    "timelineWeeks" INTEGER,
    "leetcodeUsername" TEXT,
    "readinessScore" INTEGER NOT NULL DEFAULT 0,
    "syllabus" TEXT NOT NULL DEFAULT '[]',
    "roadmap" TEXT NOT NULL DEFAULT '[]',
    "completedTopics" TEXT NOT NULL DEFAULT '[]',
    "completedRoadmapTasks" TEXT NOT NULL DEFAULT '[]',
    "taskCompletionDates" TEXT NOT NULL DEFAULT '{}',
    "revisionPlan" TEXT NOT NULL DEFAULT '[]',
    "weakAreas" TEXT NOT NULL DEFAULT '[]',
    "testFrequency" TEXT,
    "nextTestDueDate" DATETIME,
    "lastAssessmentDate" DATETIME,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AssessmentResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "level" TEXT NOT NULL,
    "domainScores" TEXT NOT NULL,
    "strengths" TEXT NOT NULL,
    "weaknesses" TEXT NOT NULL,
    "companyMatchPct" INTEGER,
    "feedback" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AssessmentResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");
