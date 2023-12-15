import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	FormControl,
	FormLabel,
	Input,
	Box,
	useToast,
	SimpleGrid 
} from "@chakra-ui/react";
import { useState } from "react";

const ModalComp = ({ data, dataEdit, isOpen, onClose, editing, onCreate, onUpdate }) => {
	const [id_estacao, setIdestacao] = useState(dataEdit.id_estacao || "");
	const [nome_estacao, setNomeestacao] = useState(dataEdit.nome_estacao || "");
	const [codigo_wmo, setCodigowmo] = useState(dataEdit.codigo_wmo || "");
	const [uf, setUF] = useState(dataEdit.uf || "");
	const [data_fundacao, setCodigodata_fundacaoIso] = useState(dataEdit.data_fundacao || "");
	const [latitude, setLatitude] = useState(dataEdit.latitude || "");
	const [longitude, setLongitude] = useState(dataEdit.longitude || "");
	const [altitude, setAltitude] = useState(dataEdit.altitude || "");


	const toast = useToast()

	const handleSave = () => {
		if (!nome_estacao || !codigo_wmo || !uf || !data_fundacao || !latitude || !longitude || !altitude) {
			toast(
				{
					position: 'top-right',
					title: 'Campos Nulos',
					description: 'Favor preencher todos os campos',
					status: 'error',
					duration: 4000,
					isClosable: true,
				});
			return
		};

		if (editing) {
			debugger
			onUpdate({ id_estacao, nome_estacao, codigo_wmo, uf, data_fundacao, latitude, longitude, altitude })
		} else {
			let id = data.length + 1;
			onCreate({ id_estacao: id, nome_estacao, codigo_wmo, uf, data_fundacao, latitude, longitude, altitude })
		}
	};


	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose} scrollBehavior='inside' size='xl'>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>{editing ? 'Editando estação : ' +id_estacao : 'Cadastro de estação'} </ModalHeader>
					<ModalCloseButton />
					<ModalBody >
						<FormControl display="flex" flexDir="column" gap={4} isRequired>
							<SimpleGrid columns={2} spacing={5}>
								<Box flex={0.5}>
										<FormLabel>Nome da Estação</FormLabel>
										<Input
											type="text"
											value={nome_estacao}
											onChange={(e) => setNomeestacao(e.target.value)} placeholder="Nome da Estação"
										/>
									</Box>
									<Box flex={0.5}>
										<FormLabel>Cod. WMO</FormLabel>
										<Input
											type="text"
											maxLength="4"
											isDisabled={editing}
											value={codigo_wmo}
											onChange={(e) => setCodigowmo(e.target.value.toUpperCase())}
											placeholder='Cod. WMO'
										/>
								</Box>
							</SimpleGrid>
							<SimpleGrid columns={2} spacing={5}>
								<Box>
									<FormLabel>UF</FormLabel>
									<Input
										type="text"
										value={uf}
										onChange={(e) => setUF(e.target.value)}
										placeholder='UF'
										required />

								</Box>
								<Box>
									<FormLabel>Cod. data_fundacao ISO</FormLabel>
									<Input
										type="text"
										maxLength="2"
										value={data_fundacao}
										onChange={(e) => setCodigodata_fundacaoIso(e.target.value.toUpperCase())}
										placeholder='Cod. data_fundacao ISO'
									/>
								</Box>
							</SimpleGrid>
							<SimpleGrid columns={2} spacing={5}>
								<Box>
									<FormLabel>Latitude</FormLabel>
									<Input
										type="text"
										value={latitude}
										onChange={(e) => setLatitude(e.target.value)}
										placeholder='Latitude'
									/>
								</Box>
								<Box>
									<FormLabel>Longitude</FormLabel>
									<Input
										type="text"
										value={longitude}
										onChange={(e) => setLongitude(e.target.value)}
										placeholder='Longitude'
									/>
								</Box>
							</SimpleGrid>
							
							<Box>
								<FormLabel>Altitude</FormLabel>
								<Input
									type="text"
									value={altitude}
									onChange={(e) => setAltitude(e.target.value)}
									placeholder="Altitude"
								/>
							</Box>
						</FormControl>
					</ModalBody>

					<ModalFooter justifyContent="flex-end">
						<Button colorScheme="red" mr={3} onClick={onClose}>
							Cancel
						</Button>
						<Button colorScheme="green" onClick={handleSave} >
							Save
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default ModalComp;
