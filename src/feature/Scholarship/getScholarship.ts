import { gql } from "urql";

export default function SCHOLARSHIP_QUERY(id: string) {
  return gql`
query Scholarships {
  scholarship(id: ${id}) {
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
        Link
        Sections {
          id
          Title
          Collapsible
          Content
        }
        FAQs {
          id
          Question
          Answer
        }
        Timeline {
          id
          Date
          Title
          Description
        }
        Organization {
          data {
            id
            attributes {
              Name
              Description
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
    }
  }
}
`;
}
