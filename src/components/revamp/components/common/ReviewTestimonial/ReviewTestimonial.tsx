import { useContext, useEffect, useState } from "react";
import Container from "~/components/structure/Container";
import SectionHeader from "../sectionHeader";
import Button from "~/components/common/Button";
import { BookDemoContext } from "~/providers/BookDemoProvider";
import ImageLoader from "~/components/common/imageLoader/imageLoader";
import Image from "next/image";
import { VideoModal } from "~/components/common/VideoModal";
import { FormModal } from "~/components/common/FormModal";


interface ReviewTestimonialProps {
  data: any;
}

export default function ReviewTestimonial({ data }: ReviewTestimonialProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openModal, setOpenModal] = useState<number>();
  const [openForm, setOpenForm] = useState(false)
  const { isDemoPopUpShown } = useContext(BookDemoContext)
  function openCurrentModal(index: number) {
    setIsOpen(() => true);
    setOpenModal(() => index);
  }

  const testimonials = data.testimonials && data.testimonials.length > 0 ? data.testimonials : null;
  const [background, setBackground] = useState<any>();
  
  useEffect(() => {
    setBackground(data.background);
  }, [data]);

  // Generate JSON-LD for videos
//   const newTestimonialList = testimonials ? testimonials.reduce(
//     (acc: any, testimonial: any) => {
//       if (testimonial.content?.videoId) {
//         return [...acc, videoJsonLd(testimonial.content)];
//       }
//       return acc;
//     },
//     []
//   ) : [];

  // console.log(testimonials, "testimonials");

  return (
    <>
      {/* <Head>
        {newTestimonialList && newTestimonialList.length > 0 && (
          <script
            type="application/ld+json"
            id="review videos"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(newTestimonialList),
            }}
          />
        )}
      </Head> */}
      <Container color="transparent" spacing={data.blockPadding ? data.blockPadding : "default"} background={background ?? "white"}>
        <div className="font-sans">
          <div className='flex md:flex-row flex-col justify-between md:items-end gap-3 items-start font-sans'>
           <SectionHeader heading={data?.headLine} />
          </div>
          
          {testimonials && (
            <div className="pt-16 md:pt-16">
              <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
                {testimonials.map((testimonial: any, index: number) => (
                  <div
                    key={testimonial.uuid || testimonial.id}
                    className={`bg-white rounded-[12px] md:rounded-[18px] border-solid border border-[rgba(0,128,128,0.1)] p-6 mb-6 break-inside-avoid ${
                      testimonial.content?.videoId ? 'relative' : ''
                    }`}
                  >
                    <div className="relative">

                      {/* Top Section - Author Info and Video Button */}
                      <div className={`flex justify-between ${testimonial.content?.videoId ? "gap-3 items-center absolute bottom-0 p-4 left-0 w-full z-[3] bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,#000_100%)]" : "mb-4  items-center"}`}>
                        <div className={`flex items-center gap-3`}>
                          <div className={`w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ${testimonial.content?.videoId ? "hidden" : ""}`}>
                            {testimonial.content?.speakerImage?.[0]?.image && (
                              <ImageLoader image={testimonial.content.speakerImage[0].image} className="w-full h-full object-cover block"/>
                            )}
                          </div>
                          <div>
                            <p className={`font-semibold text-sm ${testimonial.content?.videoId ? "text-white" : "text-gray-950"}`}>
                              {testimonial.content?.speakerName}
                            </p>
                            <p className={`text-xs ${testimonial.content?.videoId ? "text-white" : "text-gray-950"}`}>
                              {testimonial.content?.speakerPosition}
                            </p>
                          </div>
                        </div>
                        
                        {testimonial.content?.videoId && (
                          <button
                            className="w-10 h-10 bg-white/40 rounded-full border-none flex items-center justify-center flex-shrink-0 cursor-pointer"
                            onClick={() => openCurrentModal(index)}
                            title="Play"
                          >
                            <svg width="29" height="34" viewBox="0 0 29 34" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[17px] translate-x-[2px]">
                              <path d="M27.4576 15.5325C28.5875 16.1849 28.5875 17.8159 27.4576 18.4683L2.54184 32.8534C1.41187 33.5058 -0.000585209 32.6903 -0.000585152 31.3855L-0.000583894 2.61528C-0.000583837 1.31051 1.41187 0.495026 2.54184 1.14741L27.4576 15.5325Z" fill="#fff" />
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* Video Thumbnail */}
                      {testimonial.content?.videoId && (
                        <div className="relative mb-4 rounded-[6px] md:rounded-[12px] overflow-hidden">
                          <div className="absolute inset-0 z-[2] mix-blend-multiply" style={{ backgroundImage: 'linear-gradient(360deg, #2D353E 0%, rgba(45, 53, 62, 0.3) 55%, rgba(45, 53, 62, 0.2) 100%)' }}></div>
                          {testimonial.content?.videoThumbnail?.length > 0 ? (
                            <div className="aspect-video">
                              <ImageLoader image={testimonial.content.videoThumbnail[0].image} />
                            </div>
                          ) : (
                            <div className="aspect-video">
                              <Image
                                src={`https://i.ytimg.com/vi/${testimonial.content.videoId}/maxresdefault.jpg`}
                                alt={testimonial.content.statement}
                                width="640"
                                height="360"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom Section - Rating and Content */}
                    <div>
                     
                      
                      <div>
                        <h3 className="font-semibold text-gray-900 text-base mb-2 leading-tight">
                          {testimonial.content?.statement}
                        </h3>
                        
                        {/* {openModal === index && isOpen && testimonial.content?.videoId && (
                          <VideoModal   
                            videoDetails={{
                              videoId: testimonial.content.videoId,
                              videoPlatform: 'youtube',
                            }}
                            isPopup={true}
                            className={`pt-9 z-30 flex items-start`}
                            onClose={() => setIsOpen(false)}
                            openForm={() => setOpenForm(true)}
                            hasDemoBanner={true}
                          />
                        )} */}
                        
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {testimonial.content?.subStatement}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

{data?.bookBtnContent && (
                <div className="flex flex-col sm:flex-row gap-4 pt-5 justify-center lg:justify-start items-center lg:items-start >">
                 
                  {data?.bookBtnContent[0]?.buttonText && (
                    <Button
                    type="primary"
                    className="w-fit"
                    onClick={() => {
                      setOpenForm(true)
                    }}
                  >
                    <span>
                      {data?.bookBtnContent[0]?.buttonText || 'Book Free Demo'}
                    </span>
                  </Button>
                  )}
                  {data?.bookBtnContent[1]?.buttonText && (
                    <Button type="secondary" className="w-fit">
                      {data?.bookBtnContent[1]?.buttonText || 'See Pricing'}
                    </Button>
                  )}
                </div>
              )}
        </div>
        {openForm && (
          <FormModal
            className={`pt-9  flex items-start`}
            onClose={() => setOpenForm(false)}
            data={isDemoPopUpShown}
          />
        )}
      </Container>
    </>
  );
}
