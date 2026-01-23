import type { Schema, Struct } from '@strapi/strapi';

export interface ProductColorVariant extends Struct.ComponentSchema {
  collectionName: 'components_product_color_variants';
  info: {
    displayName: 'ColorVariant';
    icon: 'paint';
  };
  attributes: {
    image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    name: Schema.Attribute.String;
  };
}

export interface ProductVariant extends Struct.ComponentSchema {
  collectionName: 'components_product_variants';
  info: {
    displayName: 'Variant';
  };
  attributes: {
    color: Schema.Attribute.Component<'product.color-variant', true>;
    size: Schema.Attribute.String;
    stock: Schema.Attribute.BigInteger;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'product.color-variant': ProductColorVariant;
      'product.variant': ProductVariant;
    }
  }
}
