import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, ImageBackground, Image, StyleSheet, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton, TextInput } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-community/picker';
import axios from 'axios';

interface IBGEUfResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string;
}

const Home = () => {
    const navigation = useNavigation();

    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);


    const [selectedUf, setSelectedUf] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    function handleNavigateToPoints() {
        console.log(`Uf: ${selectedUf} - City: ${selectedCity}`)
        navigation.navigate('Points', {
            uf: selectedUf,
            city: selectedCity
        });
    }

    useEffect(() => {
        setSelectedUf('');
        setSelectedCity('');
        console.log("Setting Defaults");
    }, [])

    useEffect(() => {
        axios.get<IBGEUfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla);

            console.log(ufInitials);

            setUfs(ufInitials);
        });
    }, []);

    useEffect(() => {
        if (selectedUf === "") {
            return;
        }

        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
            const cityNames = response.data.map(city => city.nome);

            setCities(cityNames);
        });
    }, [selectedUf]);

    function handleSelectUf(uf: string) {
        console.log(`Selected: ${uf}`);
        selectedUf !== uf && setSelectedCity('')
        setSelectedUf(uf);
    }

    function handleSelectCity(city: string) {
        setSelectedCity(city)
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ImageBackground
                source={require('../../assets/home-background.png')}
                style={styles.container}
                imageStyle={styles.imageBackground}
            >
                <View style={styles.main}>
                    <View>
                        <Image source={require('../../assets/logo.png')} />
                        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                        <Text style={styles.description}>Ajudamos pessoamos a encontrarem pontos de coloeta de forma eficiente.</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Picker
                        selectedValue={selectedUf}
                        mode="dropdown"
                        onValueChange={
                            (itemValue) => handleSelectUf(String(itemValue))
                        }>
                        <Picker.Item label="Selecione a UF" value='' />
                        {ufs.map(uf => (
                            <Picker.Item key={uf} label={uf} value={uf} />
                        ))}
                    </Picker>
                    {
                        selectedUf !== "" &&
                        <Picker
                            selectedValue={selectedCity}
                            mode="dropdown"
                            onValueChange={
                                (itemValue) => handleSelectCity(String(itemValue))
                            }>
                            <Picker.Item label="Selecione a Cidade" value='' />
                            {cities.map(city => (
                                <Picker.Item key={city} label={city} value={city} />
                            ))}
                        </Picker>
                    }
                    {/* <TextInput
                        placeholder="Digite o estado"
                        style={styles.input}
                        value={selectedUf}
                        onChangeText={setSelectedUf} />
                    <TextInput
                        placeholder="Digite a cidade"
                        style={styles.input}
                        value={selectedCity}
                        onChangeText={setSelectedCity} /> */}
                    <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                        <View style={styles.buttonIcon}>
                            <Text>
                                <Icon name="arrow-right" color="#FFF" size={24} />
                            </Text>
                        </View>
                        <Text style={styles.buttonText}>
                            Entrar
                    </Text>
                    </RectButton>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    imageBackground: {
        minWidth: 242,
        minHeight: 336,
        maxWidth: 274,
        maxHeight: 368
    },

    container: {
        flex: 1,
        padding: 32
    },

    main: {
        flex: 1,
        justifyContent: 'center',
    },

    title: {
        color: '#322153',
        fontSize: 32,
        fontFamily: 'Ubuntu_700Bold',
        maxWidth: 260,
        marginTop: 64,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 16,
        fontFamily: 'Roboto_400Regular',
        maxWidth: 260,
        lineHeight: 24,
    },

    footer: {},

    select: {},

    input: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },

    button: {
        backgroundColor: '#34CB79',
        height: 60,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: 8,
    },

    buttonIcon: {
        height: 60,
        width: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    }
});

export default Home;