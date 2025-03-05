const User = require("../models/user.js");
const ConnectionRequest = require("../models/connectionRequest.js");

const calculateSkillSimilarity = (skillsA, skillsB) => {
  // Normalize skills to lowercase to handle case differences
  const normalizedSkillsA = (skillsA || []).map((skill) => skill.toLowerCase());
  const normalizedSkillsB = (skillsB || []).map((skill) => skill.toLowerCase());

  const setA = new Set(normalizedSkillsA);
  const setB = new Set(normalizedSkillsB);
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size || 0;
};

const getMutualConnectionsCount = async (userIdA, userIdB) => {
  // User A's connections
  const aRequests = await ConnectionRequest.find({
    $or: [{ fromUserId: userIdA }, { toUserId: userIdA }],
    status: "accepted",
  });
  const aConnections = aRequests.map((request) => {
    if (request.fromUserId.equals(userIdA)) return request.toUserId.toString();
    return request.fromUserId.toString();
  });

  // User B's connections
  const bRequests = await ConnectionRequest.find({
    $or: [{ fromUserId: userIdB }, { toUserId: userIdB }],
    status: "accepted",
  });
  const bConnections = bRequests.map((request) => {
    if (request.fromUserId.equals(userIdB)) return request.toUserId.toString();
    return request.fromUserId.toString();
  });

  return aConnections.filter((id) => bConnections.includes(id)).length;
};

const getRecommendations = async (user, limit = 5) => {
  const connectionRequests = await ConnectionRequest.find({
    $or: [{ fromUserId: user._id }, { toUserId: user._id }],
  });

  const excludeIds = connectionRequests.map((request) => {
    if (request.fromUserId.equals(user._id)) return request.toUserId.toString();
    return request.fromUserId.toString();
  });

  const uniqueExcludeIds = [...new Set(excludeIds)];

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
  return recommendations.sort((a, b) => b.score - a.score).slice(0, limit);
};

module.exports = { getRecommendations };
