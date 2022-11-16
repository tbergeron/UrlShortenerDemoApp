import React from "react";
import {
  Button,
  VStack,
  FormControl,
  Input,
  Text,
  WarningOutlineIcon,
  Heading
} from "native-base";
import { useAsyncStorage } from '../../AsyncStorage';
import { Keyboard } from "react-native";
import ShortenedUrlList from "../ShortenedUrlList/ShortenedUrlList";

// component state
type ShortenerState = {
  shortUrls: Array<ShortUrl>;
}
// initial state before loading from local storage
let shortenerState: ShortenerState = {
  shortUrls: []
};
// request sent to API
type ShortUrlRequest = {
  url: string;
}
// short url type
export type ShortUrl = {
  originalLink: string;
  shortUrl    : string;
  code        : string;
}

interface ShortenerFormProps {
  displayAlert: Function;
  displayLoading: Function;
  isFormDisabled: boolean;
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
      Keyboard.dismiss();
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
        setData({ url: ''})
        return false;
      }
      props.displayLoading(true);
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

        // clear form field on success
        setData({ url: ''})

        props.displayLoading(false);

        // confirmation message on success
        props.displayAlert('success', 'Link created successfully!');
      } else {
        // error message on error
        props.displayAlert('danger', 'Some error occured.');
        props.displayLoading(false);
      }
    } catch (err) {
      console.log(err);
      props.displayLoading(false);
    }
  };

  const removeItem = (shortUrl: ShortUrl) => {
    console.log('SHORTENERFORM -> REMOVING ITEM!')
    // const newList = state?.shortUrls.filter((item) => item.code !== shortUrl.code);
    // setState({ shortUrls: newList });
  };

  return (
    <>
      <VStack mx="10" mt="5">
        <FormControl isRequired isInvalid={'url' in errors}>

          <FormControl.Label _text={{ bold: true }}>URL</FormControl.Label>

          <Input placeholder="https://..."
            value={formData.url} size="xl" isDisabled={props.isFormDisabled}
            onChangeText={value => setData({ ...formData, url: value })} />

          {'url' in errors ? <FormControl.ErrorMessage mb="2" leftIcon={<WarningOutlineIcon size="xs" />}>
            {errors.url}
          </FormControl.ErrorMessage> : ""}

        </FormControl>

        <Button onPress={onSubmit} colorScheme="blue" isDisabled={props.isFormDisabled}>
          Make it short!
        </Button>

        <Heading mt="10" mb="5">
          Shortened URLs
        </Heading>

      </VStack>

      {state?.shortUrls ?
        <ShortenedUrlList items={[...state.shortUrls].reverse()}
          displayAlert={props.displayAlert} removeItem={removeItem} /> : <Text>None</Text>
      }
    </>
  );
}