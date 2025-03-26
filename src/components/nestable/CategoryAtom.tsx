import React from "react";
import Section from "../structure/Section";
import Container from "../structure/Container";
import { motion } from 'framer-motion';
import Image from 'next/image';
import Paragraph from "../typography/Paragraph";
import H2 from "../typography/H2";
import Anchor from "../common/anchor";
const CategoryAtom = ({ data }) => {
  const { listingItem } = data
  console.log(data, 'datainner');


  return (
    <Section
      className="relative overflow-hidden p-16 rounded-[32px] bg-white"
    >
      <Container>
        <motion.div
          className="flex flex-col items-center w-full"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid md:grid-cols-[1fr_1fr] gap-6 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-[415px]"
            >
              <div className="flex items-center gap-2">
                <Image
                  src={data?.icon?.url}
                  alt={data?.icon?.altText}
                  title={data?.icon?.title}
                  width={12}
                  height={12}
                  className="rounded-xl"
                />
                <Paragraph className="text-blue-600 text-sm font-semibold">{data?.name}</Paragraph>

              </div>
              <H2 className="text-3xl font-bold mt-2">
                {data?.heading}
              </H2>

              <Paragraph className="text-gray-600 mt-3">
                {data?.description}
              </Paragraph>
              {/* <Button className="mt-4">Book free demo</Button> */}
            </motion.div>
            {data?.mainImage && <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1"
            >
              <Image
                src={data?.mainImage?.url}
                alt={data?.mainImage?.altText}
                title={data?.mainImage?.title}
                width={800}
                height={500}
                className="rounded-xl"
              />
            </motion.div>}
          </div>
          <motion.div
            className="flex flex-wrap  gap-4 mt-10 w-full"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.2 }
              }
            }}
          >
            {data?.features && data?.features.map((feature, index) => (
              <motion.div
                key={index}
                className="p-6 border rounded-lg text-center shadow-sm"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <Anchor href={`features/${feature?.slug?.current}`} className="flex flex-col items-start gap-3">
                  <Image
                    src={feature?.icon?.url ||'https://cdn.sanity.io/images/76tr0pyh/production/569b5c208b3b1c9f3aa1db02247d069e8b5c7f73-24x25.svg' }
                    alt={feature?.icon?.altText}
                    title={feature?.icon?.title}
                    width={24}
                    height={24}
                    className="rounded-xl"
                  />
                  <span className="text-base">{feature.name}
                  </span>
                </Anchor>
              </motion.div>
            ))}
          </motion.div>

        </motion.div>
      </Container>
    </Section>
  );
};

export default CategoryAtom;