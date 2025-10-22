import type { Schema, Struct } from '@strapi/strapi';

export interface SharedExamples extends Struct.ComponentSchema {
  collectionName: 'components_shared_examples';
  info: {
    displayName: 'Examples';
    icon: 'code';
  };
  attributes: {
    code_snipped: Schema.Attribute.String;
    explanation: Schema.Attribute.Blocks;
    title_example: Schema.Attribute.String;
  };
}

export interface SharedHints extends Struct.ComponentSchema {
  collectionName: 'components_shared_hints';
  info: {
    displayName: 'Hints';
    icon: 'lightbulb';
  };
  attributes: {
    hint_text: Schema.Attribute.String;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedResources extends Struct.ComponentSchema {
  collectionName: 'components_shared_resources';
  info: {
    displayName: 'resources';
    icon: 'book';
  };
  attributes: {
    description_resource: Schema.Attribute.Blocks;
    title_resource: Schema.Attribute.String;
    type_resource: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    url_resource: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.examples': SharedExamples;
      'shared.hints': SharedHints;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.resources': SharedResources;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
    }
  }
}
