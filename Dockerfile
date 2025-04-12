# Usa uma imagem do nginx
FROM nginx:alpine

# Remove o conteúdo padrão
RUN rm -rf /usr/share/nginx/html/*

# Copia seus arquivos para a pasta servida pelo Nginx
COPY . /usr/share/nginx/html

# Expõe a porta 80
EXPOSE 80