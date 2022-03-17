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
import { Checkbox } from '@strapi/design-system/Checkbox';
import { Stack } from '@strapi/design-system/Stack';
import { Select, Option } from '@strapi/design-system/Select';
import { ToggleInput } from '@strapi/design-system/ToggleInput';
import { Typography } from '@strapi/design-system/Typography';
import { Grid, GridItem } from '@strapi/design-system/Grid';
import { Formik } from 'formik';
import {
    Form,
    LoadingIndicatorPage,
    useNotification,
    useOverlayBlocker,
} from '@strapi/helper-plugin';
import { useNotifyAT } from '@strapi/design-system/LiveRegions';

// Icons
import Check from '@strapi/icons/Check';


const HomePage = (ctx) => {
    const toggleNotification = useNotification();
    const { lockApp, unlockApp } = useOverlayBlocker();

    const queryClient = useQueryClient();
    const query = useQuery('settings', getSettings)
    const mutation = useMutation(settings => updateSettings(settings), {
        onSuccess: async () => {
            // Refresh after mutation
            await queryClient.invalidateQueries('settings');
            toggleNotification({
                type: 'success',
                message: { id: 'strapi-tiptap-editor-save-success', defaultMessage: 'Saved' },
            });
            unlockApp()
        },
        onError: async () => {
            toggleNotification({
                type: 'warning',
                message: { id: 'strapi-tiptap-editor-save-error', defaultMessage: 'Saved failed' },
            });
            unlockApp()
        }
    })

    const addRemoveFromList = (list, val) => {
        if (!list.includes(val)) {
            list.push(val)
        } else {
            list.splice(list.indexOf(val), 1)
        }
        return list
    }

    if (query.isLoading) {
        return (
            <Main aria-busy="true">
                <HeaderLayout
                    title={'Strapi TipTap Editor settings'}
                    subtitle={'Change how the editor should behave'}
                />
                <ContentLayout>
                    <LoadingIndicatorPage />
                </ContentLayout>
            </Main>
        );
    }


    return (
        <Main aria-busy={query.isLoading}>
            <Formik
                initialValues={query.data}
                onSubmit={async (values) => {
                    lockApp()
                    await mutation.mutateAsync(values)
                }}>
                {({ errors, values, handleChange, isSubmitting }) => {
                    return (
                        <Form>
                            <HeaderLayout
                                title={'Strapi TipTap Editor settings'}
                                subtitle={'Change how the editor should behave'}
                                primaryAction={
                                    <Button
                                        isLoading={mutation.isLoading}
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
                                    <Grid gap={6}>
                                        <GridItem col={12} s={12}>
                                            <Typography variant="beta" as="h2">Heading</Typography>
                                        </GridItem>
                                        <GridItem col={12} s={12}>
                                            <ToggleInput
                                                label="Heading 1"
                                                size="S"
                                                name="headings"
                                                onLabel='Enabled'
                                                offLabel='Disabled'
                                                checked={values.headings.includes('h1')}
                                                onChange={e => handleChange({ target: { name: 'headings', value: addRemoveFromList([...values.headings], 'h1')}})} />
                                        </GridItem>
                                        <GridItem col={12} s={12}>
                                            <ToggleInput
                                                label="Heading 2"
                                                size="S"
                                                name="headings"
                                                onLabel='Enabled'
                                                offLabel='Disabled'
                                                checked={values.headings.includes('h2')}
                                                onChange={e => handleChange({ target: { name: 'headings', value: addRemoveFromList([...values.headings], 'h2')}})} />
                                        </GridItem>
                                        <GridItem col={12} s={12}>
                                            <ToggleInput
                                                label="Heading 3"
                                                size="S"
                                                name="headings"
                                                onLabel='Enabled'
                                                offLabel='Disabled'
                                                checked={values.headings.includes('h3')}
                                                onChange={e => handleChange({ target: { name: 'headings', value: addRemoveFromList([...values.headings], 'h3')}})} />
                                        </GridItem>
                                        <GridItem col={12} s={12}>
                                            <ToggleInput
                                                label="Heading 4"
                                                size="S"
                                                name="headings"
                                                onLabel='Enabled'
                                                offLabel='Disabled'
                                                checked={values.headings.includes('h4')}
                                                onChange={e => handleChange({ target: { name: 'headings', value: addRemoveFromList([...values.headings], 'h4')}})} />
                                        </GridItem>
                                        <GridItem col={12} s={12}>
                                            <ToggleInput
                                                label="Heading 5"
                                                size="S"
                                                name="headings"
                                                onLabel='Enabled'
                                                offLabel='Disabled'
                                                checked={values.headings.includes('h5')}
                                                onChange={e => handleChange({ target: { name: 'headings', value: addRemoveFromList([...values.headings], 'h5')}})} />
                                        </GridItem>
                                        <GridItem col={12} s={12}>
                                            <ToggleInput
                                                label="Heading 6"
                                                size="S"
                                                name="headings"
                                                onLabel='Enabled'
                                                offLabel='Disabled'
                                                checked={values.headings.includes('h6')}
                                                onChange={e => handleChange({ target: { name: 'headings', value: addRemoveFromList([...values.headings], 'h6')}})} />
                                        </GridItem>

                                        {/*
                                        Text style
                                        */}
                                        <GridItem col={12} s={12}>
                                            <Typography variant={'beta'}>Text styles</Typography>
                                        </GridItem>
                                        <GridItem col={12}>
                                            <ToggleInput
                                                label="Bold"
                                                name="bold"
                                                size="S"
                                                onLabel='Enabled'
                                                offLabel='Disabled'
                                                checked={values.bold}
                                                onChange={e => handleChange({ target: { name: 'bold', value: !values.bold } })} />
                                        </GridItem>
                                        <GridItem col={12}>
                                            <ToggleInput
                                                label="Italic"
                                                name="italic"
                                                size="S"
                                                onLabel='Enabled'
                                                offLabel='Disabled'
                                                checked={values.italic}
                                                onChange={e => handleChange({ target: { name: 'italic', value: !values.italic } })} />
                                        </GridItem>
                                        <GridItem col={12}>
                                            <ToggleInput
                                                label="Strikethrough"
                                                name="strikethrough"
                                                size="S"
                                                onLabel='Enabled'
                                                offLabel='Disabled'
                                                checked={values.strikethrough}
                                                onChange={e => handleChange({ target: { name: 'strikethrough', value: !values.strikethrough } })} />
                                        </GridItem>
                                        <GridItem col={12}>
                                            <ToggleInput
                                                label="Underline"
                                                name="underline"
                                                size="S"
                                                onLabel='Enabled'
                                                offLabel='Disabled'
                                                checked={values.underline}
                                                onChange={e => handleChange({ target: { name: 'underline', value: !values.underline } })} />
                                        </GridItem>

                                        {/*
                                        Alignment
                                        */}
                                        <GridItem col={12} s={12}>
                                            <Typography variant={'beta'}>Text alignment</Typography>
                                        </GridItem>
                                        <GridItem col={12}>
                                            <ToggleInput
                                                label="Left"
                                                size="S"
                                                name="align"
                                                onLabel='Enabled'
                                                offLabel='Disabled'
                                                checked={values.align.includes('left')}
                                                onChange={e => handleChange({ target: { name: 'align', value: addRemoveFromList([...values.align], 'left')}})} />
                                        </GridItem>
                                        <GridItem col={12}>
                                            <ToggleInput
                                                label="Center"
                                                size="S"
                                                name="align"
                                                onLabel='Enabled'
                                                offLabel='Disabled'
                                                checked={values.align.includes('center')}
                                                onChange={e => handleChange({ target: { name: 'align', value: addRemoveFromList([...values.align], 'center')}})} />
                                        </GridItem>
                                        <GridItem col={12}>
                                            <ToggleInput
                                                label="Right"
                                                size="S"
                                                name="align"
                                                onLabel='Enabled'
                                                offLabel='Disabled'
                                                checked={values.align.includes('right')}
                                                onChange={e => handleChange({ target: { name: 'right', value: addRemoveFromList([...values.align], 'right')}})} />
                                        </GridItem>
                                    </Grid>
                                </Box>
                            </ContentLayout>
                    </Form>
                )}}
            </Formik>
        </Main>
  );
};

export default memo(HomePage);
