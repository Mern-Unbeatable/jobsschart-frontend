import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import FaqHeader from '../sections/FaqHeader';
import FaqPublishedSection from '../sections/FaqPublishedSection';
import FaqPendingQuestionsSection from '../sections/FaqPendingQuestionsSection';
import FaqArticleModal from '../sections/FaqArticleModal';
import FaqAnswerModal from '../sections/FaqAnswerModal';
import {
  useGetFaqsQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
  useGetAllCommunityQuestionsAdminQuery,
  useAnswerCommunityQuestionAdminMutation,
} from '../../../../features/api/faqApi';

const FAQ_TABS = [
  {
    id: 'published',
    label: 'Published FAQs',
  },
];

const AdminFaq = () => {
  const [activeTab, setActiveTab] = useState('published');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState('create');
  const [editingFaqId, setEditingFaqId] = useState(null);
  const [draftQuestion, setDraftQuestion] = useState('');
  const [draftAnswer, setDraftAnswer] = useState('');
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
  const [selectedPendingQuestion, setSelectedPendingQuestion] = useState(null);
  const [publishQuestionTitle, setPublishQuestionTitle] = useState('');
  const [publishAnswerContent, setPublishAnswerContent] = useState('');

  const { data: faqData, isLoading: isFaqLoading } = useGetFaqsQuery();
  const { data: questionsData, isLoading: isQuestionsLoading } = useGetAllCommunityQuestionsAdminQuery();

  const [createFaq] = useCreateFaqMutation();
  const [updateFaq] = useUpdateFaqMutation();
  const [deleteFaq] = useDeleteFaqMutation();
  const [answerCommunityQuestion] = useAnswerCommunityQuestionAdminMutation();

  const faqs = faqData?.faqs || [];
  const questions = questionsData?.questions || [];
  const pendingQuestions = questions.filter((q) => q.status === "PENDING");

  const openEditor = (faq = null) => {
    setEditorMode(faq ? 'edit' : 'create');
    setEditingFaqId(faq?.id ?? null);
    setDraftQuestion(faq?.question || '');
    setDraftAnswer(faq?.answer || '');
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditorMode('create');
    setEditingFaqId(null);
    setDraftQuestion('');
    setDraftAnswer('');
  };

  const handleSave = async () => {
    if (!draftQuestion.trim() || !draftAnswer.trim()) {
      return;
    }

    try {
      if (editorMode === 'edit') {
        const loadingToast = toast.loading("Updating FAQ...");
        await updateFaq({
          id: editingFaqId,
          question: draftQuestion,
          answer: draftAnswer,
        }).unwrap();
        toast.dismiss(loadingToast);
        toast.success("FAQ updated successfully");
      } else {
        const loadingToast = toast.loading("Creating FAQ...");
        await createFaq({
          question: draftQuestion,
          answer: draftAnswer,
          sortOrder: 1,
        }).unwrap();
        toast.dismiss(loadingToast);
        toast.success("FAQ created successfully");
      }
      closeEditor();
    } catch (err) {
      toast.dismiss();
      toast.error(err?.data?.message || "Failed to save FAQ");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this FAQ!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#EF4444",
    });

    if (!result.isConfirmed) return;

    try {
      const loadingToast = toast.loading("Deleting FAQ...");
      await deleteFaq(id).unwrap();
      toast.dismiss(loadingToast);
      toast.success("FAQ deleted successfully");
    } catch (err) {
      toast.dismiss();
      toast.error(err?.data?.message || "Failed to delete FAQ");
    }
  };

  const openAnswerModal = (pendingQuestion) => {
    setSelectedPendingQuestion(pendingQuestion);
    setPublishQuestionTitle(pendingQuestion.subject || pendingQuestion.question);
    setPublishAnswerContent('');
    setIsAnswerModalOpen(true);
  };

  const closeAnswerModal = () => {
    setIsAnswerModalOpen(false);
    setSelectedPendingQuestion(null);
    setPublishQuestionTitle('');
    setPublishAnswerContent('');
  };

  const handlePublish = async () => {
    if (!publishAnswerContent.trim() || !selectedPendingQuestion?.id) {
      toast.error("Please provide an answer content.");
      return;
    }

    try {
      const loadingToast = toast.loading("Answering question...");
      await answerCommunityQuestion({
        id: selectedPendingQuestion.id,
        answer: publishAnswerContent,
      }).unwrap();
      toast.dismiss(loadingToast);
      toast.success("Question answered successfully");
      closeAnswerModal();
    } catch (err) {
      toast.dismiss();
      toast.error(err?.data?.message || "Failed to answer question");
    }
  };

  if (isFaqLoading || isQuestionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500/60" />
      </div>
    );
  }

  return (
    <section className='space-y-4 sm:space-y-5'>
      <FaqHeader onAddNew={() => openEditor()} />

      <FaqPublishedSection
        activeTab={activeTab}
        onTabChange={setActiveTab}
        faqs={faqs}
        onEdit={openEditor}
        onDelete={handleDelete}
      />

      <FaqPendingQuestionsSection
        items={pendingQuestions}
        onAnswer={openAnswerModal}
      />

      <FaqArticleModal
        isOpen={isEditorOpen}
        mode={editorMode}
        question={draftQuestion}
        answer={draftAnswer}
        onQuestionChange={setDraftQuestion}
        onAnswerChange={setDraftAnswer}
        onClose={closeEditor}
        onSave={handleSave}
      />

      <FaqAnswerModal
        isOpen={isAnswerModalOpen}
        pendingQuestion={selectedPendingQuestion}
        title={publishQuestionTitle}
        answer={publishAnswerContent}
        onTitleChange={setPublishQuestionTitle}
        onAnswerChange={setPublishAnswerContent}
        onClose={closeAnswerModal}
        onPublish={handlePublish}
      />
    </section>
  );
};

export default AdminFaq;
