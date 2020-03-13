FROM hivemq/hivemq4

RUN curl -L https://www.hivemq.com/releases/extensions/hivemq-enterprise-security-extension-1.4.0.zip -o /opt/hivemq-ese.zip \
    && unzip /opt/hivemq-ese.zip -d /opt/hivemq/extensions/ \
    && rm /opt/hivemq-ese.zip

COPY config.xml /opt/hivemq/conf/config.xml
COPY logback.xml /opt/hivemq/conf/logback.xml
COPY enterprise-security-extension.xml /opt/hivemq/extensions/hivemq-enterprise-security-extension/enterprise-security-extension.xml
