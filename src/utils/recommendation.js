const User = require("../models/user.js");
const ConnectionRequest = require("../models/connectionRequest.js");

// Calculate similarity between two sets of skills using Jaccard Index
const calculateSkillSimilarity = (skillsA, skillsB) => {
  const normalizedSkillsA = (skillsA || []).map((skill) => skill.toLowerCase());
  const normalizedSkillsB = (skillsB || []).map((skill) => skill.toLowerCase());
  const setA = new Set(normalizedSkillsA);
  const setB = new Set(normalizedSkillsB);
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size || 0;
};

// Count mutual connections between two users
const getMutualConnectionsCount = async (userIdA, userIdB) => {
  const aRequests = await ConnectionRequest.find({
    $or: [{ fromUserId: userIdA }, { toUserId: userIdA }],
    status: "accepted",
  });
  const aConnections = aRequests.map((request) =>
    request.fromUserId.equals(userIdA)
      ? request.toUserId.toString()
      : request.fromUserId.toString()
  );

  const bRequests = await ConnectionRequest.find({
    $or: [{ fromUserId: userIdB }, { toUserId: userIdB }],
    status: "accepted",
  });
  const bConnections = bRequests.map((request) =>
    request.fromUserId.equals(userIdB)
      ? request.toUserId.toString()
      : request.fromUserId.toString()
  );

  return aConnections.filter((id) => bConnections.includes(id)).length;
};

// Generate recommendations with proper pagination
const getRecommendations = async (user, limit = 10, skip = 0) => {
  // Fetch all connection requests involving the user
  const connectionRequests = await ConnectionRequest.find({
    $or: [{ fromUserId: user._id }, { toUserId: user._id }],
  });

  // IDs to exclude (users already connected or requested)
  const excludeIds = connectionRequests.map((request) =>
    request.fromUserId.equals(user._id)
      ? request.toUserId.toString()
      : request.fromUserId.toString()
  );
  const uniqueExcludeIds = [...new Set(excludeIds)];

  // Fetch all users except the logged-in user and excluded IDs
  const allUsers = await User.find({
    _id: { $ne: user._id, $nin: uniqueExcludeIds },
  });

  const recommendations = [];
  for (const otherUser of allUsers) {
    const skillSimilarity = calculateSkillSimilarity(
      user.skills,
      otherUser.skills
    );
    const mutualCount = await getMutualConnectionsCount(
      user._id,
      otherUser._id
    );
    const score = skillSimilarity * 0.7 + (mutualCount / 10) * 0.3;
    recommendations.push({
      user: {
        _id: otherUser._id,
        firstName: otherUser.firstName,
        lastName: otherUser.lastName,
        skills: otherUser.skills,
        photoURL: otherUser.photoURL,
        dob: otherUser.dob,
        about: otherUser.about,
        gender: otherUser.gender,
      },
      score,
      mutualConnections: mutualCount,
    });
  }

  // Sort by score and apply pagination
  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(skip, skip + limit);
};

module.exports = { getRecommendations };
