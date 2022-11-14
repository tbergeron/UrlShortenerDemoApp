import React from "react";
import {
  Button,
  VStack,
  FormControl,
  Input,
  Heading,
  Text,
  FlatList,
  Box,
  HStack,
  Spacer
} from "native-base";
import { useAsyncStorage } from '../../AsyncStorage';
import * as Clipboard from 'expo-clipboard';
import { GestureResponderEvent } from "react-native";

// component state
type ShortenerState = {
  shortUrls: Array<ShortUrl>;
};
// initial state before loading from local storage
let shortenerState: ShortenerState = {
  shortUrls: []
};
// request sent to API
type ShortUrlRequest = {
  url: string;
};
// short url type
type ShortUrl = {
  originalLink: string;
  shortUrl: string;
  code: string;
};

interface ShortenedListProps {
  displayAlert: Function;
  items: Array<ShortUrl>;
}

function ShortenedUrlList(props: ShortenedListProps) {
  const copyToClipboard = async (event: GestureResponderEvent, item: ShortUrl) => {
    event.preventDefault();
    await Clipboard.setStringAsync(item.shortUrl);
    console.log('URL Copied to Clipboard: ' + item.shortUrl);
    props.displayAlert('info', 'Copied to clipboard!');
  };

  return (
    <>
      <Heading mt="10" mb="5">
        Shortened URLs
      </Heading>

      <FlatList data={props.items} renderItem={({ item }) =>
        <Box pl={["0", "4"]} pr={["0", "5"]} py="2">
          <HStack space={[2, 3]} justifyContent="space-between">
            <VStack>
              <Text color="coolGray.600">
                {item.shortUrl}
              </Text>
              <Spacer />
              <Text fontSize="xs" color="coolGray.800">
                {item.originalLink}
              </Text>
            </VStack>
            <Spacer />
            <Button colorScheme="blue" onPress={(event) => copyToClipboard(event, item)}>Copy</Button>
          </HStack>
        </Box>} keyExtractor={item => item.code} />
    </>
  );
}

interface ShortenerFormProps {
  displayAlert: Function;
}

export default function ShortenerForm(props: ShortenerFormProps) {
  const [state, setState] = useAsyncStorage('short-urls', shortenerState);
  const [formData, setData] = React.useState({});
  const [errors, setErrors] = React.useState({});

  const validateUrl = (value: string) => {
    const pattern = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    const regexp = new RegExp(pattern);
    return (regexp.test(value)) ? true : false;
  };

  const validate = () => {
    setErrors({});
    if (formData.url === undefined) {
      setErrors({ ...errors, url: 'URL is required' });
      return false;
    } else if (formData.url.length < 3) {
      setErrors({ ...errors, url: 'URL is too short' });
      return false;
    } else if (!validateUrl(formData.url)) {
      setErrors({ ...errors, url: 'URL is invalid' });
      return false;
    }
    return true;
  };

  const onSubmit = () => {
    if (validate()) {
      createShortenedUrl({ url: formData.url} );
    }
  };

  const createShortenedUrl = async (shortUrlRequest: ShortUrlRequest) => {
    const API_BASE = 'https://api.shrtco.de/v2/';
    const buildUrl = (uri: String) => API_BASE + uri;
    console.log('Sending request to API:', shortUrlRequest);
    try {

      // mssage for when URL already exists?
      if (state?.shortUrls.some((shortUrl: ShortUrl) => shortUrl.originalLink === shortUrlRequest.url)) {
        // error message on error
        props.displayAlert('danger', 'URL already exists');
        return false;
      }

      let res = await fetch(buildUrl('shorten?url=' + shortUrlRequest.url));
      let resJson = await res.json();
      console.log('response', resJson);

      if (resJson.result) {
        // create new shortUrl
        let newShortUrl: ShortUrl = {
          originalLink: resJson.result.original_link,
          shortUrl:     resJson.result.full_short_link,
          code:         resJson.result.code
        };
        // push new short url to data store
        setState({ shortUrls: [...state?.shortUrls, newShortUrl] })

        // TODO: clear form field on success
        // reset();

        // confirmation message on success
        props.displayAlert('success', 'Link created successfully!');
      } else {
        // error message on error
        props.displayAlert('danger', 'Some error occured.');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return <VStack mx="10" mt="5">
    <FormControl isRequired isInvalid={'url' in errors}>

      <FormControl.Label _text={{ bold: true }}>URL</FormControl.Label>

      <Input placeholder="https://..."
        onChangeText={value => setData({ ...formData, url: value })} />

      {'url' in errors ? <FormControl.ErrorMessage>
        {errors.url}
      </FormControl.ErrorMessage> : ""}

    </FormControl>

    <Button onPress={onSubmit} colorScheme="blue">
      Make it short!
    </Button>

    {state?.shortUrls ?
      <ShortenedUrlList items={state.shortUrls} displayAlert={props.displayAlert} /> : <Text>None</Text>
    }

  </VStack>;
}