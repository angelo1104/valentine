const getLengthOfChain = async (Model) => {
  try {
    const count = await Model.countDocuments().exec();
    return count;
  } catch (e) {
    throw new Error(e.message);
  }
};

export default getLengthOfChain;
