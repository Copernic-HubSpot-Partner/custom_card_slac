import {
    Accordion,
    Box,
    Button,
    ButtonRow,
    Divider,
    Flex,
    Image,
    Input, LoadingSpinner,
    Text,
    TextArea,
    Tile
} from "@hubspot/ui-extensions";
import {useEffect, useState} from "react";

export const Channel = ({channelInfos}) => {
    const [isLoading, setIsLoading] = useState(!channelInfos);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (channelInfos && channelInfos.users && channelInfos.messages) {
            // Créer une map pour les utilisateurs
            const usersMap = new Map(channelInfos.users.map(user => [user.id, user]));

            // Mettre à jour les messages avec les infos des utilisateurs
            const updatedMessages = channelInfos.messages.map(message => ({
                ...message,
                user_info: usersMap.get(message.user),
                content: replaceMentionsWithNames(message.content, usersMap),
                timestamp: formatTimestamp(message.timestamp)
            })).reverse();

            setMessages(updatedMessages);
            setIsLoading(false);
        }
    }, [channelInfos]);

    const replaceMentionsWithNames = (message, usersMap) => {
        const mentionRegex = /<@(\w+)>/g;
        return message.replace(mentionRegex, (match, userId) => {
            const user = usersMap.get(userId);
            return user ? `@${user.name}` : match;
        });
    }

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString("fr-FR") + ' ' + date.toLocaleTimeString("fr-FR");
    }


    // Style pour le conteneur des messages
    const messageContainerStyle = {
        maxWidth: '50px', // Limite la largeur maximale
        overflowY: 'auto', // Permet un défilement vertical si le contenu dépasse
    };


    return (
        // Main content
        <Flex direction='column'>
            {/* Header avec le nom du channel slack et les participants */}
            <Tile>
                <Flex direction='row' gap='sm'>
                    {isLoading ? (
                        <Flex direction='row' gap='sm'>
                            <LoadingSpinner/>
                            <Text>Chargement...</Text>
                        </Flex>

                    ) : (
                        <>
                            <Accordion title="Slacks Channels Name" defaultOpen={false} disabled={true} size={'sm'}>
                                <Text>suspendisse potenti nullam ac tortor vitae purus faucibus ornare suspendisse sed
                                    nisi
                                    lacus sed viverra tellus in hac habitasse platea dictumst vestibulum rhoncus est
                                    pellentesque</Text>
                            </Accordion>
                            <Flex gap={'xs'} justify={'end'}>
                                <Image
                                    src='https://ca.slack-edge.com/T06AMU20RA6-U06ASDUGR4K-gdea7eee9143-192'
                                    alt='placeholder'
                                    width='24'
                                    height='24'
                                />
                                <Image
                                    src='https://ca.slack-edge.com/T06AMU20RA6-U06ASDUGR4K-gdea7eee9143-192'
                                    alt='placeholder'
                                    width='24'
                                    height='24'
                                />
                                <Image
                                    src='https://ca.slack-edge.com/T06AMU20RA6-U06ASDUGR4K-gdea7eee9143-192'
                                    alt='placeholder'
                                    width='24'
                                    height='24'
                                />
                                <Text>3</Text>
                            </Flex>
                        </>
                    )}
                </Flex>
            </Tile>

            {/* Container des messages et de l'input pour envoyer un message*/}
            <Tile>
                {/* Messages */}
                <Flex direction='column' gap='sm'>
                {isLoading ? (
                    <Flex direction='row' gap='sm'>
                        <LoadingSpinner/>
                        <Text>Chargement...</Text>
                    </Flex>

                ) : (
                    messages.map((message) => (
                        (
                            <Flex direction='row' gap='sm' style={messageContainerStyle} className="Hello-world">

                                <Image
                                    src={message.user_info.avatar}
                                    alt='placeholder'
                                    width='55'
                                    height='48'
                                />
                                <Flex direction='column'>
                                    <Flex direction='row' gap={'sm'}>
                                        <Text format={{fontWeight: 'bold'}}>{message.user_info.name}</Text>
                                        <Text format={{fontWeight: 'light'}}>Heure</Text>
                                    </Flex>
                                    {/* Text lorem 25*/}
                                    <Text>
                                        {message.content}
                                    </Text>
                                </Flex>
                            </Flex>

                        )
                    ))

                )}
                </Flex>
                <Divider/>
                <Flex
                    direction='row'
                    gap='sm'
                >

                    <TextArea placeholder="Message #Channel's Name"/>
                    <Button
                        type="submit"
                        variant='primary'
                        size='xs'
                        style={{height: '10px'}}
                    >
                        Envoyer
                    </Button>
                </Flex>
            </Tile>
        </Flex>
    );
};

