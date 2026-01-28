import React from 'react';

// Props interface for consistent icon sizing
interface IconProps {
    className?: string;
    style?: React.CSSProperties;
}

const BaseIcon = ({ src, alt, className, style }: IconProps & { src: string, alt: string }) => (
    <img
        src={src}
        alt={alt}
        className={className}
        style={{ ...style, objectFit: 'contain' }}
    />
);

// --- HOMEPAGE / INDEX ICONS ---
export const NextJsIcon = (props: IconProps) => <BaseIcon {...props} src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg" alt="Next.js" />;
export const ReactIcon = (props: IconProps) => <BaseIcon {...props} src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" alt="React" />;
export const PythonIcon = (props: IconProps) => <BaseIcon {...props} src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" alt="Python" />;
export const DjangoIcon = (props: IconProps) => <BaseIcon {...props} src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg" alt="Django" />;
export const AwsIcon = (props: IconProps) => <BaseIcon {...props} src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" alt="AWS" />;
export const PostgreSqlIcon = (props: IconProps) => <BaseIcon {...props} src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" />;
export const DockerIcon = (props: IconProps) => <BaseIcon {...props} src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" alt="Docker" />;
export const FastApiIcon = (props: IconProps) => <BaseIcon {...props} src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg" alt="FastAPI" />;
export const GitIcon = (props: IconProps) => <BaseIcon {...props} src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" alt="Git" />;
export const TypeScriptIcon = (props: IconProps) => <BaseIcon {...props} src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" alt="TypeScript" />;

// --- PROJECT ARCHIVE ICONS ---
export const PhpIcon = (props: IconProps) => <BaseIcon {...props} src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg" alt="PHP" />;
export const MySqlIcon = (props: IconProps) => <BaseIcon {...props} src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" alt="MySQL" />;
export const RedisIcon = (props: IconProps) => <BaseIcon {...props} src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg" alt="Redis" />;
export const CppIcon = (props: IconProps) => <BaseIcon {...props} src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg" alt="C++" />;
export const QtIcon = (props: IconProps) => <BaseIcon {...props} src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/qt/qt-original.svg" alt="Qt" />;
export const RabbitMqIcon = (props: IconProps) => <BaseIcon {...props} src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rabbitmq/rabbitmq-original.svg" alt="RabbitMQ" />;
