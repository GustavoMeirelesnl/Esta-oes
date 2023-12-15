import { EditIcon, DeleteIcon, AddIcon, SearchIcon } from "@chakra-ui/icons";
import {
	Box,
	Flex,
	Button,
	useDisclosure,
	Table,
	Thead,
	Tr,
	Th,
	Tbody,
	Td,
	useBreakpointValue,
	IconButton,
	Input,
	Center, useToast
} from "@chakra-ui/react";
import HeaderComponent from './components/Header'
import { useEffect, useState } from "react";
import ModalComp from "./components/ModalComp";
import useApi from "./hooks/useApi";

const App = () => {
	const api = useApi();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [data, setData] = useState([]);
	const [dataOri, setDataOri] = useState([]);
	const [dataEdit, setDataEdit] = useState({});
	const [editing, setEditing] = useState(false);
	const [serching, setSerching] = useState(false);
	const [serchText, setSerchText] = useState('');

	const toast = useToast()

	const isMobile = useBreakpointValue({
		base: true,
		lg: false,
	});


	useEffect(() => {
		let request = true;

		if (request) onRead();

		return () => {
			request = false;
		}
	}, [setData]);


	const onRead = () => {
		api.get('estacoes')
			.then(({ data }) => {
				setData(data.estacao);
			})
			.catch(err => console.log(err));
	}

	const onCreate = (data) => {
		const formData = data;
		api.post(`estacoes`, { ...formData })
			.then(({ data, response }) => {
				console.log(data);
				console.log(response);
				if (response.status == 201) {
					toast(
						{
							position: 'top-right',
							title: editing ? 'Atualizado com sucesso' : 'Inserido com sucesso',
							description: editing ? `estacao ${data.estacao.nome_estacao} atualizado com sucesso` : `estacao ${data.estacao.nome_estacao} adicionado com sucesso`,
							status: 'success',
							duration: 4000,
							isClosable: true,
						});
					onClose();
					onRead();
				} else {
					toast(
						{
							position: 'top-right',
							title: 'Erro ao Inserir',
							description: `Erro : ${data.msg}`,
							status: 'error',
							duration: 4000,
							isClosable: true,
						});
				}

			})
			.catch(err => {
				console.log(err);
			});
	}

	const onUpdate = (data) => {
		const formData = data;
		api.put(`estacoes/${data.codigo_wmo}`, { ...formData })
			.then(({ data, response }) => {
				if (response.status == 200) {
					toast(
						{
							position: 'top-right',
							title: 'Atualizado com sucesso',
							description: `estacao ${data.estacao.nome_estacao} atualizado com sucesso`,
							status: 'success',
							duration: 4000,
							isClosable: true,
						});
					onClose();
					onRead();
				} else {
					toast(
						{
							position: 'top-right',
							title: 'Erro ao Atualizar',
							description: `Erro : ${data.msg}`,
							status: 'error',
							duration: 4000,
							isClosable: true,
						});
				}

			})
			.catch(err => console.log(err));
	}

	const onDelete = (codigo_wmo) => {
		api.remove(`estacoes/${codigo_wmo}`)
			.then(({ response }) => {
				toast(
					{
						position: 'top-right',
						title: 'Registro Deletado',
						description: `estacao wmo "${codigo_wmo}" excluído com sucesso`,
						status: 'success',
						duration: 4000,
						isClosable: true,
					});
				onRead();
			})
			.catch(err => console.log(err));
	}


	const handleSearch = () => {
		if (serchText.length < 4) {
			toast(
				{
					position: 'top-right',
					title: 'Código wmo',
					description: 'Favor colocar os 4 caracteres para busca',
					status: 'error',
					duration: 4000,
					isClosable: true,
				});
		} else {
			setSerching(!serching)
			if (!serching) {
				api.get(`estacoes/${serchText}`)
					.then(({ data, response }) => {
						if (response.status == 200) {
							setData(data.estacao);
						} else {
							toast(
								{
									position: 'top-right',
									title: 'Erro na Busca',
									description: `Não encontramos o estacao de Cod. WMO :${serchText} `,
									status: 'error',
									duration: 4000,
									isClosable: true,
								});
						}
					})
					.catch(err => console.log(err));
			} else {
				setSerchText('')
				onRead();
			}
		}
	}

	return (
		<Flex
			direction={"column"}
			align="center"
			justify="center"
			fontSize="20px"
			fontFamily="poppins"
		>
			<HeaderComponent />

			<Box width="100%" padding="30px">
				<Box as='row'>
					<Center>
						{isMobile ?
							<IconButton icon={<AddIcon />} colorScheme="teal" onClick={() => [setEditing(false), setDataEdit({}), onOpen()]} />
						: <Button pl={20} pr={20} colorScheme="teal" onClick={() => [setEditing(false), setDataEdit({}), onOpen()]}>
								CADASTRAR ESTAÇÃO
							</Button>
						}

						<Input ml={isMobile ? 5 : 20}
							isDisabled={serching}
							type="text"
							maxLength="4"
							value={serchText}
							onChange={(e) => setSerchText(e.target.value.toUpperCase())}>
						</Input>
						<IconButton ml={1} icon={serching ? <DeleteIcon /> : <SearchIcon />} colorScheme={serching ? "red" : "teal"} onClick={() => handleSearch()}/>
					</Center>
				</Box>

				<Box overflowY="scroll" height="70vh" width="100%" mt={10}>
					<Table variant='striped' colorScheme='gray'>
						<Thead>
							<Tr>
								<Th maxW={isMobile ? 5 : 100} fontSize="15px">
									ID
								</Th>
								<Th maxW={isMobile ? 5 : 100} fontSize="15px">
									Nome
								</Th>
								<Th maxW={isMobile ? 5 : 100} fontSize="15px">
									WMO
								</Th>
								<Th maxW={isMobile ? 5 : 200} fontSize="15px">
									UF
								</Th>
								<Th maxW={isMobile ? 5 : 1000} fontSize="15px">
									Data Fund.
								</Th>
								<Th maxW={isMobile ? 5 : 200} fontSize="15px">
									Lat.
								</Th>
								<Th maxW={isMobile ? 5 : 200} fontSize="15px">
									Long.
								</Th>
								<Th maxW={isMobile ? 5 : 200} fontSize="15px">
									Alt.
								</Th>
								<Th p={0}></Th>
								<Th p={0}></Th>
							</Tr>
						</Thead>
						<Tbody>
							{data.map(({ id_estacao, nome_estacao, codigo_wmo, uf, data_fundacao, latitude, longitude, altitude }, index) => (
								<Tr key={index} cursor="pointer " _hover={{ bg: "gray.100" }}>
									<Td maxW={isMobile ? 5 : 100}>{id_estacao}</Td>
									<Td maxW={isMobile ? 5 : 100}>{nome_estacao}</Td>
									<Td maxW={isMobile ? 5 : 100}>{codigo_wmo}</Td>
									<Td maxW={isMobile ? 5 : 100}>{uf}</Td>
									<Td maxW={isMobile ? 5 : 100}>{data_fundacao}</Td>
									<Td maxW={isMobile ? 5 : 100}>{latitude}</Td>
									<Td maxW={isMobile ? 5 : 100}>{longitude}</Td>
									<Td maxW={isMobile ? 5 : 100}>{altitude}</Td>
									<Td p={0}>
										<EditIcon
											fontSize={20}
											onClick={() => [
												setEditing(true),
												setDataEdit({ id_estacao, nome_estacao, codigo_wmo, uf, data_fundacao, latitude, longitude, altitude, index }),
												onOpen(),
											]}
										/>
									</Td>
									<Td p={0}>
										<DeleteIcon
											fontSize={20}
											onClick={() => onDelete(codigo_wmo)}
										/>
									</Td>
								</Tr>
							))}
						</Tbody>
					</Table>
				</Box>
			</Box>
			{isOpen && (
				<ModalComp
					isOpen={isOpen}
					onClose={onClose}
					data={data}
					editing={editing}
					dataEdit={dataEdit}
					setDataEdit={setDataEdit}
					onCreate={onCreate}
					onUpdate={onUpdate}
				/>
			)}
		</Flex>
	);
};

export default App;
