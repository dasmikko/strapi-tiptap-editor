import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Stack } from '@strapi/design-system/Stack';
import { Box } from '@strapi/design-system/Box';
import { Typography } from '@strapi/design-system/Typography';
import MediaLib from '../MediaLib/index.js';
import Editor from '../Editor';
import { useIntl } from 'react-intl';
import {getSettings} from "../../../../utils/api";
import {defaultSettings} from "../../../../utils/defaults";
import { useQuery } from 'react-query';

const Wysiwyg = ({ name, onChange, value, intlLabel, disabled, error, description, required }) => {
  const { formatMessage } = useIntl();
  const [ mergedSettings, setMergedSettings] = useState(null)
  const {data: settings, isLoading} = useQuery('settings', getSettings, {
    onSuccess: async (values) => {
      // Save the settings to state when fetched
      setMergedSettings({...defaultSettings, ...values})
    }
  })

  if (isLoading || !mergedSettings) {
    // Do not show the editor till we have fetched the editor settings
    return null
  }

  return (
      <>
        <Stack spacing={1}>
          <Box>
            <Typography variant="pi" fontWeight="bold">
              {formatMessage(intlLabel)}
            </Typography>
            {required &&
                <Typography variant="pi" fontWeight="bold" textColor="danger600">*</Typography>
            }
          </Box>
          <Editor
              key={isLoading ? 'loading' : 'loaded'}
              disabled={disabled}
              name={name}
              onChange={onChange}
              value={value}
              settings={mergedSettings}
          />
          {error &&
              <Typography variant="pi" textColor="danger600">
                {formatMessage({ id: error, defaultMessage: error })}
              </Typography>
          }
          {description &&
              <Typography variant="pi">
                {formatMessage(description)}
              </Typography>
          }
        </Stack>
      </>
  );
};

Wysiwyg.defaultProps = {
  description: '',
  disabled: false,
  error: undefined,
  intlLabel: '',
  required: false,
  value: '',
};

Wysiwyg.propTypes = {
  description: PropTypes.shape({
    id: PropTypes.string,
    defaultMessage: PropTypes.string,
  }),
  disabled: PropTypes.bool,
  error: PropTypes.string,
  intlLabel: PropTypes.shape({
    id: PropTypes.string,
    defaultMessage: PropTypes.string,
  }),
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  value: PropTypes.string,
};

export default Wysiwyg;
