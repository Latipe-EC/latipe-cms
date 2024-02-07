import Box from "@components/Box";
import Footer from "@components/landing/Footer";
import Section1 from "@components/landing/Section1";
import Section2 from "@components/landing/Section2";
import Section3 from "@components/landing/Section3";
import Section4 from "@components/landing/Section4";
import Section5 from "@components/landing/Section5";

const IndexPage = () => {
	return (
		<Box id="top" overflow="hidden" bg="gray.white">
			<Section1 />
			<Section2 />
			<Section3 />
			<Section4 />
			<Section5 />
			<Footer />
		</Box>
	);
};

export default IndexPage;
