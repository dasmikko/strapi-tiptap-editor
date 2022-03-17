/*
 *
 * HomePage
 *
 */

import React, { memo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import pluginId from '../../pluginId';
import { getSettings, updateSettings } from '../../../../utils/api.js'

// Fields and UI
import { Main } from '@strapi/design-system/Main';
import { HeaderLayout, ContentLayout } from '@strapi/design-system/Layout';
import { Button } from '@strapi/design-system/Button';
import { Box } from '@strapi/design-system/Box';
import { Stack } from '@strapi/design-system/Stack';
import { Select, Option } from '@strapi/design-system/Select';
import { Typography } from '@strapi/design-system/Typography';
import { Grid, GridItem } from '@strapi/design-system/Grid';
import { Formik, Field, Form } from 'formik';

// Icons
import Check from '@strapi/icons/Check';


const HomePage = (ctx) => {
  console.log(ctx, strapi)


  const query = useQuery('settings', getSettings)

  const onClickSave = (settings) => {
    console.log('update the settings!')

    updateSettings().then(response => {
      console.log(response)
    })
  }


  return (
    <Main>
      <HeaderLayout
        title={'Strapi TipTap Editor settings'}
        subtitle={'Change how the editor should behave'}
        primaryAction={
          <Button
            onClick={onClickSave}
            type="submit"
            startIcon={<Check />}
            size="L"
          >
            Save
          </Button>
        }
      />
      <ContentLayout>
        <Box
          background="neutral0"
          hasRadius
          shadow="filterShadow"
          paddingTop={6}
          paddingBottom={6}
          paddingLeft={7}
          paddingRight={7}
        >
          <h1>{pluginId}&apos;s HomePage</h1>
          <p>Happy coding</p>

          {!query.isLoading ? <p>{JSON.stringify(query.data)}</p> : null }

            <Formik
                initialValues={{
                    firstName: '',
                    lastName: '',
                    email: '',
                }}
                onSubmit={async (values) => {
                    await new Promise((r) => setTimeout(r, 500));
                    alert(JSON.stringify(values, null, 2));
                }}
            >
            </Formik>

          <Grid gap={6}>
            <GridItem col={6} s={12}>
            </GridItem>
          </Grid>
        </Box>
      </ContentLayout>
    </Main>
  );
};

export default memo(HomePage);
