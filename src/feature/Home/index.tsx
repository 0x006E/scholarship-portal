import {
  ButtonBack,
  ButtonNext,
  CarouselProvider,
  DotGroup,
  Slide,
  Slider,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import { createRef, useEffect, useRef, useState } from "react";
import Skeleton from "react-loading-skeleton";
import SimpleBar from "simplebar-react";
import { useQuery } from "urql";
import { BASE_URL } from "../../api";
import MainLogo from "../../assets/main-logo.svg";
import Card from "../../components/Card";
import Footer from "../../components/Footer";
import SlideHero from "../../components/SlideHero";
import ErrorPage from "../ErrorPage";
import { ORGANIZATION_DATA, SCHOLARSHIP_DATA } from "./getData";
import classes from "./Home.module.scss";
import IMG1 from "./img1.png";
import IMG2 from "./img2.png";
const types = [
  { type: "scholarship", text: "Scholarships" },
  { type: "award", text: "Awards" },
  { type: "internship", text: "Internships" },
  // { type: "grants", text: "Funds & Grants" },
  { type: "fellowship", text: "Fellowships" },
  // { type: "contest", text: "Contests" },
];

const categorize = function (scholarships: any) {
  const categorized = types.reduce((acc: any, type) => {
    acc[`${type.type}`] = scholarships?.scholarships.data.filter(
      (scholarship: any) => scholarship.attributes.Type === type.type
    );
    return acc;
  }, {});
  return categorized;
};

function Home() {
  const simpleBar = createRef<SimpleBar>();
  const typeRef = useRef<(HTMLElement | null)[]>([]);
  const _heroCarousel = Math.floor(window.innerWidth / 700);
  const _scholarshipCarousel = Math.floor(window.innerWidth / 340);
  const [visible, setVisible] = useState({
    heroCarousel: _heroCarousel === 0 ? 1 : _heroCarousel,
    scholarshipCarousel: _scholarshipCarousel === 0 ? 1 : _scholarshipCarousel,
  });

  useEffect(() => {
    simpleBar.current && simpleBar.current.recalculate();
  }, [simpleBar]);

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      let num1 = Math.floor(window.innerWidth / 680);
      let num2 = Math.floor(window.innerWidth / 340);
      setVisible({
        heroCarousel: num1 === 0 ? 1 : num1,
        scholarshipCarousel: num2 === 0 ? 1 : num2,
      });
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  const [{ data: scholarships, fetching, error }] = useQuery({
    query: SCHOLARSHIP_DATA,
  });

  const scholarshipsCategories = scholarships && categorize(scholarships);

  const [{ data: organizations, fetching: loadingOrg, error: errorOrg }] =
    useQuery({
      query: ORGANIZATION_DATA,
    });

  if (error || errorOrg) return <ErrorPage />;

  //const isNotDesktop = useMediaQuery({ query: "(max-width: 850px)" });

  const firstSectionRef = createRef<HTMLDivElement>();
  return (
    <SimpleBar ref={simpleBar} className={classes.container}>
      <section className={classes.hero}>
        <img
          className={classes.Logo}
          src={MainLogo}
          width={150}
          alt="INSIGHTER"
        />

        <div className={classes.heroText}>
          <div className={classes.heroTextContent}>
            <div className={classes.heroTextTitle}>
              Find the right opportunities for you
            </div>
          </div>
        </div>
      </section>
      {fetching ? (
        <div className={classes.slides}>
          <Skeleton
            style={{
              height: "393px",
              width: "100%",
              borderRadius: 15,
            }}
          />
        </div>
      ) : (
        <CarouselProvider
          naturalSlideWidth={680}
          naturalSlideHeight={393}
          totalSlides={scholarships?.scholarships.data.length}
          isIntrinsicHeight
          visibleSlides={visible.heroCarousel}
          isPlaying
        >
          <div className={classes.slides}>
            <Slider>
              {scholarships?.scholarships.data.length > 2 ? (
                scholarships?.scholarships.data.map(
                  (item: any, idx: number) => (
                    <Slide index={item.id} key={item.id}>
                      <SlideHero
                        title={item.attributes.Name}
                        img={idx % 2 === 0 ? IMG1 : IMG2}
                      />
                    </Slide>
                  )
                )
              ) : (
                <>
                  <Slide index={0}>
                    <SlideHero title={""} loading />
                  </Slide>
                  <Slide index={1}>
                    <SlideHero title={""} loading />
                  </Slide>
                </>
              )}
            </Slider>
            <ButtonBack className={classes.btnBack}>
              <svg
                width="33"
                height="33"
                viewBox="0 0 33 33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.8198 19.4139L18.1311 25.7252C18.3887 25.9813 18.7372 26.125 19.1005 26.125C19.4637 26.125 19.8122 25.9813 20.0698 25.7252C20.1987 25.5973 20.301 25.4453 20.3708 25.2777C20.4406 25.1101 20.4766 24.9304 20.4766 24.7489C20.4766 24.5674 20.4406 24.3877 20.3708 24.2201C20.301 24.0526 20.1987 23.9005 20.0698 23.7727L13.7448 17.4752C13.616 17.3473 13.5137 17.1953 13.4439 17.0277C13.3741 16.8601 13.3381 16.6804 13.3381 16.4989C13.3381 16.3174 13.3741 16.1377 13.4439 15.9701C13.5137 15.8026 13.616 15.6505 13.7448 15.5227L20.0698 9.22516C20.3288 8.96807 20.4749 8.61865 20.4762 8.25377C20.4775 7.8889 20.3338 7.53845 20.0767 7.27954C19.8196 7.02062 19.4702 6.87443 19.1053 6.87314C18.7405 6.87185 18.39 7.01557 18.1311 7.27266L11.8198 13.5839C11.0474 14.3573 10.6135 15.4058 10.6135 16.4989C10.6135 17.592 11.0474 18.6405 11.8198 19.4139Z"
                  fill="currentColor"
                />
              </svg>
            </ButtonBack>
            <ButtonNext className={classes.btnNext}>
              <svg
                width="33"
                height="33"
                viewBox="0 0 33 33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.1802 13.5861L14.8689 7.27484C14.6113 7.01874 14.2628 6.875 13.8995 6.875C13.5363 6.875 13.1878 7.01874 12.9302 7.27484C12.8013 7.40266 12.699 7.55474 12.6292 7.7223C12.5594 7.88985 12.5234 8.06957 12.5234 8.25109C12.5234 8.43261 12.5594 8.61233 12.6292 8.77988C12.699 8.94744 12.8013 9.09952 12.9302 9.22734L19.2552 15.5248C19.384 15.6527 19.4863 15.8047 19.5561 15.9723C19.6259 16.1399 19.6619 16.3196 19.6619 16.5011C19.6619 16.6826 19.6259 16.8623 19.5561 17.0299C19.4863 17.1974 19.384 17.3495 19.2552 17.4773L12.9302 23.7748C12.6712 24.0319 12.5251 24.3814 12.5238 24.7462C12.5225 25.1111 12.6662 25.4615 12.9233 25.7205C13.1804 25.9794 13.5298 26.1256 13.8947 26.1269C14.2595 26.1281 14.61 25.9844 14.8689 25.7273L21.1802 19.4161C21.9526 18.6426 22.3865 17.5942 22.3865 16.5011C22.3865 15.408 21.9526 14.3595 21.1802 13.5861Z"
                  fill="currentColor"
                />
              </svg>
            </ButtonNext>
            <DotGroup className={classes.dots} />
          </div>
        </CarouselProvider>
      )}

      <main>
        <section className={classes.categories} ref={firstSectionRef}>
          <h1>Categories</h1>

          <div className={classes.categoriesContent}>
            {types.map((type, idx) => (
              <div
                onClick={() => {
                  typeRef.current[idx]?.scrollIntoView({
                    behavior: "smooth",
                    block: "end",
                  });
                }}
                className={classes.categoryItem}
                key={idx}
              >
                <div className={classes.categoryItemText}>
                  <span>{type.text}</span>
                </div>
                <div
                  data-text={type.type}
                  className={classes.categoryItemImg}
                ></div>
              </div>
            ))}
          </div>
        </section>
        <section className={classes.orgs}>
          <h1>{loadingOrg ? <Skeleton width="10ch" /> : "Powered by"} </h1>
          <div className={classes.orgsContent}>
            {!fetching ? (
              organizations?.organizations.data.map((org: any, idx: number) => (
                <div className={classes.org} key={idx}>
                  <img
                    src={`${BASE_URL}${org.attributes.Logo.data.attributes.url}`}
                    className={classes.orgImg}
                    alt={org.attributes.Name}
                  />
                </div>
              ))
            ) : (
              <Skeleton
                style={{ boxShadow: "none", border: 0 }}
                className={classes.org}
              />
            )}
          </div>
        </section>
        {!fetching ? (
          Object.keys(scholarshipsCategories).map((type, idx) => (
            <CarouselProvider
              naturalSlideWidth={320}
              naturalSlideHeight={200}
              totalSlides={scholarshipsCategories[type]?.length}
              isIntrinsicHeight
              key={type}
              visibleSlides={visible.scholarshipCarousel}
            >
              <section
                className={classes.orgs}
                ref={(el) => (typeRef.current[idx] = el)}
              >
                <h1>{types.find((t) => t.type === type)?.text}</h1>
                {scholarshipsCategories[type]?.length > 0 ? (
                  <>
                    <Slider classNameTray={classes.cards}>
                      {scholarshipsCategories[type]?.map(
                        (scholarship: any, idx: number) => (
                          <Slide index={idx} key={scholarship.id}>
                            <Card
                              logo={`${BASE_URL}${scholarship.attributes.Logo.data.attributes.url}`}
                              title={scholarship.attributes.Name}
                              description={scholarship.attributes.Description}
                              org={
                                scholarship.attributes.Organization.data
                                  .attributes.Name
                              }
                              id={scholarship.id}
                            />
                          </Slide>
                        )
                      )}
                    </Slider>
                    {scholarshipsCategories[type].length >
                    visible.scholarshipCarousel ? (
                      <>
                        <ButtonBack className={classes.btnBack}>
                          <svg
                            width="16"
                            height="16"
                            xmlns="http://www.w3.org/2000/svg"
                            fillRule="evenodd"
                            clipRule="evenodd"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M2.117 12l7.527 6.235-.644.765-9-7.521 9-7.479.645.764-7.529 6.236h21.884v1h-21.883z" />
                          </svg>
                        </ButtonBack>
                        <ButtonNext className={classes.btnNext}>
                          <svg
                            width="16"
                            height="16"
                            xmlns="http://www.w3.org/2000/svg"
                            fillRule="evenodd"
                            clipRule="evenodd"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z" />
                          </svg>
                        </ButtonNext>
                      </>
                    ) : null}
                  </>
                ) : (
                  <span className={classes.error}>
                    Nothing seems to be available now. Please check back later.
                  </span>
                )}
              </section>
            </CarouselProvider>
          ))
        ) : (
          <section className={classes.orgs}>
            <h1>
              <Skeleton width={"20ch"} />
            </h1>
            <Card loading />
          </section>
        )}
      </main>
      <Footer />
    </SimpleBar>
  );
}

export default Home;
