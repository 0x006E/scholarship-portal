import { gql } from "urql";

export const ORGANIZATION_DATA = gql`
  query {
    organizations {
      data {
        id
        attributes {
          Logo {
            data {
              id
              attributes {
                url
              }
            }
          }
        }
      }
    }
  }
`;

export const SCHOLARSHIP_DATA = gql`
  query {
    scholarships {
      data {
        id
        attributes {
          Name
          Description
          Type
          Banner {
            data {
              id
              attributes {
                url
              }
            }
          }
          Logo {
            data {
              id
              attributes {
                url
              }
            }
          }
          Organization {
            data {
              id
              attributes {
                Name
              }
            }
          }
        }
      }
    }
  }
`;
