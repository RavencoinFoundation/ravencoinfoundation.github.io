module.exports = {
  siteMetadata: {
    title: "Ravencoin Foundation",
  },
  plugins: [
    "gatsby-plugin-styled-components",
    "gatsby-plugin-sharp",
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/raven-icon-negative.png",
      },
    },
    {
      resolve: "gatsby-plugin-verify-brave",
      options: {
        token: "8cc1d44f1a7b13b875e60d1a4c7f0cf5f9b7858e83aef729bcccccfb5bf4352a",
        domain: "ravencoin.foundation"
      },
    },        
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
    "gatsby-plugin-eslint",
  ],
};
