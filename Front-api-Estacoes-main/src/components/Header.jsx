import React from 'react';
import {
	Box,
	Heading,
	Flex,
	ButtonGroup,
	Button,
	Spacer
} from "@chakra-ui/react";

const HeaderComponent = () => (
	<Flex padding="15px" color="white" bg="gray.700" minWidth='100%' alignItems='center' gap='3'>
		<Box p='2'>
			<Heading size='md'>API Estações</Heading>
		</Box>
	</Flex>
)

export default HeaderComponent;