import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';

const BlogGrid = memo(({ blogs }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleReadMore = (slug) => {
    navigate(`/blog/${slug}`);
  };

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
      {blogs.map((blog) => (
        <div 
          key={blog.id} 
          className='group bg-white rounded-xl border border-[#EAB308]/30 p-2 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full'
        >
          <div className='relative overflow-hidden rounded-lg mb-4 h-48 shrink-0'>
            {blog.image ? (
              <img 
                src={blog.image} 
                alt={blog.title}
                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                loading='lazy'
              />
            ) : (
              <div className='w-full h-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-400 border border-dashed border-gray-300 rounded-lg'>
                No Image
              </div>
            )}
          </div>
          
          <div className='px-2 pb-2 flex flex-col flex-1'>
            <div className='flex items-center gap-4 text-base text-gray-400 mb-3'>
              <div className='flex items-center gap-1'>
                <Calendar size={18} />
                <span>{blog.date}</span>
              </div>
              <div className='flex items-center gap-1'>
                <User size={18} />
                <span>{blog.author}</span>
              </div>
            </div>

            <h3 className='text-2xl font-medium text-gray-800 mb-3 leading-snug group-hover:text-[#EAB308] transition-colors line-clamp-2'>
              {blog.title}
            </h3>
            
            <p className='text-gray-500 text-base leading-relaxed mb-6 line-clamp-3'>
              {blog.desc}
            </p>

            <button 
              onClick={() => handleReadMore(blog.slug)}
              className='w-full bg-[#EAB308] hover:bg-[#d99a00] text-white py-2.5 rounded-md text-sm flex items-center justify-center gap-2 transition-colors shadow-sm uppercase tracking-wider mt-auto'
            >
              {t('blog.card.readMore')} <ArrowRight size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
});

BlogGrid.displayName = 'BlogGrid';

export default BlogGrid;
