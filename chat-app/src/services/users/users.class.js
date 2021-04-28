const { Service } = require('feathers-nedb');

const crypto = require('crypto');

// The Gravatar image service
const gravatarUrl = 'https://avataaars.io/?avatarStyle=Circle&topType=ShortHairSides&accessoriesType=Round&hairColor=PastelPink&facialHairType=MoustacheMagnum&facialHairColor=Black&clotheType=Overall&clotheColor=Blue03&eyeType=Squint&eyebrowType=Default&mouthType=Vomit&skinColor=Yellow';

// The size query. Our chat needs 60px images
const query = 's=60';
// Returns the Gravatar image for an email
const getGravatar = email => {
  // Gravatar uses MD5 hashes from an email address (all lowercase) to get the image
  const hash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
  // Return the full avatar URL
  return `${gravatarUrl}/${hash}?${query}`;
};

exports.Users = class Users extends Service {
  create (data, params) {
    // This is the information we want from the user signup data
    const { email, password, githubId } = data;
    // Use the existing avatar image or return the Gravatar for the email
    const avatar = data.avatar || getGravatar(email);
    // The complete user
    const userData = {
      email,
      password,
      githubId,
      avatar
    };

    // Call the original `create` method with existing `params` and new data
    return super.create(userData, params);
  } 
};
