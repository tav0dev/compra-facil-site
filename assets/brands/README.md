# Recursos oficiais de terceiros

Obtidos em 6 de setembro de 2026, diretamente das páginas de marca. Não são
desenhos próprios nem glifos do Font Awesome. As marcas pertencem aos respectivos
titulares; seu uso identifica links e canais, sem indicar parceria ou endosso.

- **WhatsApp:** [Meta Brand Resource Center](https://www.meta.com/brand/resources/whatsapp/whatsapp-brand/).
  Pacote `WhatsApp-Brand-Resource-Center.zip`, arquivos
  `Digital_Glyph_Green_RGB_2026.png` e `Digital_Glyph_White_RGB_2026.png`.
  SHA-256 do pacote: `31cd2eaacb0abfd3640e51cb807c21dafba872e3aff8e520ff20ee6a1b01498f`.
- **Instagram:** [Meta Brand Resource Center](https://www.meta.com/brand/resources/instagram/instagram-brand/).
  Pacote `IG_brand_asset_pack_2023.zip`, arquivos `Instagram_Glyph_Gradient.png`
  e `Instagram_Glyph_White.png`.
  SHA-256 do pacote: `a9e5cbe63dc01279b3d12d536ea9d94ab5236521601bd5cc4b4caf7ba7060e82`.
- **Google Play:** [Partner Marketing Hub](https://partnermarketinghub.withgoogle.com/brands/google-play/google-play/lockups-icons-badges/?folder=86642).
  Arquivo `GetItOnGooglePlay_Badge_Web_color_Portuguese-Brazil.png`, copiado
  integralmente, 478 × 142 px.
  SHA-256: `a67bb5551e4b4c14a3fe79837f2c56133f86c698fb0fa9263359dc37c99af785`.

Os glifos Meta são apenas reamostrados para 256 px por
`tool/import_official_brand_assets.dart`, preservando proporções, transparência
e cores. O app seleciona as variantes oficiais clara/colorida conforme o fundo;
não aplica tintas arbitrárias. O selo Google Play mantém margem mínima de 1/4
da sua altura e é usado inteiro nos links de download, nunca como um triângulo
isolado ou um selo reconstruído com texto/CSS.

Para atualizar, baixe novamente os pacotes oficiais, revise as diretrizes e os
hashes, execute o importador e sincronize a cópia em `compra-facil-site/assets/brands`.
