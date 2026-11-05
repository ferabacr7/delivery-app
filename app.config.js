
module.exports = ({ config }) => {
  const googleMapsApiKey = process.env.GOOGLE_MAPS_ANDROID_API_KEY;

  return {
    ...config,
    plugins: [
      ...(config.plugins ?? []),
      ...(googleMapsApiKey
        ? [
            [
              "react-native-maps",
              {
                androidGoogleMapsApiKey: googleMapsApiKey,
              },
            ],
          ]
        : []),
    ],
  };
};
