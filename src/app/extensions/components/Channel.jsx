import {
    Accordion,
    Box,
    Button,
    ButtonRow,
    Divider,
    Flex,
    Image,
    Input,
    Text,
    TextArea,
    Tile
} from "@hubspot/ui-extensions";
import {useState} from "react";

export const Channel = ({messages}) => {


    return (
        // Main content
        <Flex direction='column'>
            {/* Header avec le nom du channel slack et les participants */}
            <Tile>
                <Flex direction='row' gap='sm'>
                    <Accordion title="Slacks Channels Name" defaultOpen={false} disabled={true} size={'sm'}>
                        <Text>suspendisse potenti nullam ac tortor vitae purus faucibus ornare suspendisse sed nisi
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

                </Flex>
            </Tile>

            {/* Container des messages et de l'input */}
            <Tile>
                {/* Messages */}
                <Flex direction='row' gap='sm'>
                    <Image
                        src='https://ca.slack-edge.com/T06AMU20RA6-U06ASDUGR4K-gdea7eee9143-192'
                        alt='placeholder'
                        width='55'
                        height='48'
                    />
                    <Flex direction='column'>
                        <Flex direction='row' gap={'sm'}>
                            <Text format={{fontWeight: 'bold'}}>Prénom Nom</Text>
                            <Text format={{fontWeight: 'light'}}>Heure</Text>
                        </Flex>
                        {/* Text lorem 25*/}
                        <Text>
                            suspendisse potenti nullam ac tortor vitae purus faucibus ornare suspendisse
                        </Text>
                    </Flex>
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