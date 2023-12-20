import {Flex, Text, Tile} from "@hubspot/ui-extensions";

export const Channel = () => {
    return (
        <Flex
            direction={'row'}
            justify={'end'}
            wrap={'wrap'}
        >
            <Flex direction={'column'}>
                <Tile>#Channel Name</Tile>
            </Flex>
            <Flex direction={'column'}>
                <Tile>
                    <Flex direction={'column'}>
                        <Text>Channel Name</Text>
                        <Text>Channel Name</Text>
                    </Flex>
                </Tile>
            </Flex>
        </Flex>
    );
};